export async function sendWelcomeEmail(user: { id: string; email: string }) {
  "use step";

  console.log(`Sending welcome email to: ${user.email}`);
  // email sending logic here
}
