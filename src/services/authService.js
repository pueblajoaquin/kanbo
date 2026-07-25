const bcrypt = require(`bcrypt`);
const prisma = require(`../prisma`);

const SALT_ROUNDS = 10;

async function registerUser({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('EMAIL_ALREADY_IN_USE');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return { id: user.id, name: user.name, email: user.email };
}

module.exports = { registerUser };
