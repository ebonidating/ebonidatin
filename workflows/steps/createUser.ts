export async function createUser(email: string) {
  "use step";

  console.log(`Creating user with email: ${email}`);
  const user = { id: crypto.randomUUID(), email };
  return user;
}
