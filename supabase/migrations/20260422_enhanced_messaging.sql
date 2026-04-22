-- Enhanced Messaging System Migration
-- Adds support for typing indicators, read receipts, rich media, and message reactions

-- Add new columns to chat_messages table
ALTER TABLE IF EXISTS public.chat_messages
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'voice', 'gif', 'link')),
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_metadata JSONB,
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reply_to_message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS has_read_receipt BOOLEAN DEFAULT false;

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create message_read_receipts table
CREATE TABLE IF NOT EXISTS public.message_read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Create typing_indicators table for real-time typing notifications
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

-- Create message_attachments table for handling multiple files
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON public.message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON public.message_read_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_match_id ON public.typing_indicators(match_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_created_at ON public.typing_indicators(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_type ON public.chat_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_reply_to ON public.chat_messages(reply_to_message_id);

-- Enable RLS on new tables
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions on their messages" ON public.message_reactions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions to messages in their chats" ON public.message_reactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own reactions" ON public.message_reactions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for message_read_receipts
CREATE POLICY "Users can view read receipts on their messages" ON public.message_read_receipts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can mark messages as read" ON public.message_read_receipts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for typing_indicators
CREATE POLICY "Users can view typing indicators in their chats" ON public.typing_indicators
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add typing indicators" ON public.typing_indicators
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their typing indicators" ON public.typing_indicators
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for message_attachments
CREATE POLICY "Users can view attachments from their messages" ON public.message_attachments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can manage attachments" ON public.message_attachments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to mark message as read and create read receipt
CREATE OR REPLACE FUNCTION public.mark_message_as_read(
  p_message_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Insert read receipt
  INSERT INTO public.message_read_receipts (message_id, user_id, read_at)
  VALUES (p_message_id, p_user_id, NOW())
  ON CONFLICT (message_id, user_id) DO UPDATE SET read_at = NOW();

  -- Update has_read_receipt flag if this is the receiver
  UPDATE public.chat_messages
  SET has_read_receipt = true
  WHERE id = p_message_id AND receiver_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators
  WHERE created_at < NOW() - INTERVAL '30 seconds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add message attachment
CREATE OR REPLACE FUNCTION public.add_message_attachment(
  p_message_id UUID,
  p_file_url TEXT,
  p_file_type TEXT,
  p_file_size INTEGER DEFAULT NULL,
  p_file_name TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_attachment_id UUID;
BEGIN
  INSERT INTO public.message_attachments (
    message_id,
    file_url,
    file_type,
    file_size,
    file_name,
    metadata
  ) VALUES (
    p_message_id,
    p_file_url,
    p_file_type,
    p_file_size,
    p_file_name,
    p_metadata
  )
  RETURNING id INTO v_attachment_id;

  RETURN v_attachment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.mark_message_as_read(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_typing_indicators() TO service_role;
GRANT EXECUTE ON FUNCTION public.add_message_attachment(UUID, TEXT, TEXT, INTEGER, TEXT, JSONB) TO service_role;
