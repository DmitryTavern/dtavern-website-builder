# Gulp website builder

It's the most powerful website builder that I have ever created. Builder can from source files output files with optimization.

## Get Started

Install modules:

```
npm i
```

Start development:

```
npm run start
```

Build project:

```
npm run build
```

## Features

### 1. Artisan

Powerful tool for fast developing. Artisan - it is commander for control
pages and components.

Commands:

- **create:page** - create new page
- **rename:page** - rename exists page
- **create:component** - create new component
- **rename:component** - rename exists component
- **reinject:components** - reinject all components to pages/global
- **remove:components** - remove components
- **install:store** - install component store from git
- **update:store** - update component store
- **import:store** - import components from store to project

### 2. Structure

Based on my experience, I have decided that the current structure will be the most efficient for developing small/medium projects as well as large ones.

```
├── artisan/
├── scripts/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── img/
│   │   ├── js/
│   │   ├── sass/
│   │   └── sprite/
│   ├── components/
│   │   ├── [category]/
│   │   │   └── [component]/
│   │   └── config.json
│   └── views/
│       ├── helpers/
│       ├── layouts/
│       ├── pages/
│       ├── styles/
│       └── scripts/
├── types/
├── utilities/
├── .browserslistrc
├── .env
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── gulpfile.ts
├── LICENSE
├── package-lock.json
├── package.json
├── readme.md
└── tsconfig.json
```

### 3. Optimizations

You can change the file and then will compiled only what is associated with this file.

Also, you can use `artisan` in runtime.

### 4. Own components store

For this website builder was created most popular components. You can install
it form `artisan`.

## Future

1. Improve readme.md file. Describe the nuances of working with the builder.
2. Improve js output.
