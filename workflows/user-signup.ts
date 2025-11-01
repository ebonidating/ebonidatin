// import { sleep } from "workflow";
import { createUser } from "./steps/createUser";
import { sendWelcomeEmail } from "./steps/sendWelcomeEmail";
import { sendOnboardingEmail } from "./steps/sendOnboardingEmail";

export async function handleUserSignup(email: string) {
  "use workflow";

  const user = await createUser(email);
  await sendWelcomeEmail(user);

  // await sleep("5s");
  await new Promise(resolve => setTimeout(resolve, 5000));
  await sendOnboardingEmail(user);

  return { userId: user.id, status: "onboarded" };
}
