const generateMigrationDate = () => {
  const now = new Date();
  const isoDate = now.toISOString().replaceAll(/\D/g, '').slice(0, 14); // Remove non-numeric characters and keep the first 14 characters

  return isoDate;
};

export default function (plop) {
  plop.setGenerator('migration', {
    description: 'migration file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'migration name',
      },
    ],
    actions: () => {
      return [
        {
          type: 'add',
          path: `migrations/${generateMigrationDate()}-{{name}}.ts`,
          templateFile: 'plop-templates/migration.hbs',
        },
      ];
    },
  });
}
