export async function sendOnboardingEmail(user: { id: string; email: string }) {
  "use step";

  if (!user.email.includes("@")) {
    throw new Error("Invalid user email");
  }

  console.log(`Sending onboarding email to: ${user.email}`);
  // onboarding email logic here
}
