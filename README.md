# S'NCE - Pokemon Team Builder project

### What's missing?

- [ ] Pokemon abilities
- [ ] Pokemon types filter
- [ ] Pokemon types recap
- [ ] Better pokemon card UI
- [ ] Clean up the code inside the navigation

## Description

This project is a Pokemon Team Builder application that allows users to create and manage, their Pokemon teams. It provides a user-friendly interface for adding and removing random Pokemon, as well as viewing detailed information about each Pokemon. The application leverages the Pokemon API to fetch data about Pokemon species and abilities, ensuring that users have access to up-to-date information.

## Choices and decisions

### Starting template

I used t3 stack template as a starting point for this project. It provides a solid foundation for building full-stack applications with Next.js, Prisma, and PostgreSQL. [T3 stack](https://create.t3.gg/)

### Data fetching

I'm using a combination of Next.js server actions and React Query's queries and mutations to handle data fetching and state management efficiently. This approach leverages the strengths of both technologies to ensure optimal performance and seamless user experiences.

### Database choice

I chose to use a PostgreSQL database for this project because it is a robust and reliable relational database that offers excellent performance and scalability. Also, it's fully compatible with Prisma, which simplifies database interactions and ensures data integrity.

### Main Packages Used

- **Next.js**: I chose Next.js because it is an excellent framework for React, offering features that improve both development efficiency and application performance. It excels in server-side rendering and static site generation, which enhances SEO and provides a seamless deployment experience.

- **React Query**: React Query is my go-to library for managing data fetching and caching. It simplifies asynchronous operations and ensures efficient state management, making it a powerful tool for handling server state in React applications.

- **Framer Motion**: Framer Motion is my preferred library for creating animations. It offers a simple and intuitive API for designing complex animations and interactions, which significantly enhances the user experience.

- **Tailwind CSS**: Tailwind CSS is a utility-first CSS framework that provides a highly efficient way to style applications. Its utility classes allow for rapid development and consistent design, making it easy to create responsive and visually appealing interfaces.

- **ShadcnUI**: ShadcnUI is a comprehensive library of UI components that streamline the development process. Its ready-to-use components adhere to best practices and design principles, facilitating the creation of professional and polished user interfaces.

- **TanStack Table**: TanStack Table is an excellent library for building powerful and flexible tables in React. It offers extensive features for data presentation and interaction, ensuring that tables are both functional and aesthetically pleasing.

- **Zod**: Zod is a robust library for schema validation and state management. It ensures that the application state adheres to predefined schemas, which helps in maintaining data integrity and reducing runtime errors.

- **React Hook Form**: React Hook Form is a lightweight library for managing form state in React applications. It simplifies form validation and submission, making it easy to create dynamic and interactive forms.

- **Prisma**: Prisma is an ORM that simplifies database interactions in Node.js applications. It provides a type-safe API for querying databases, which enhances developer productivity and ensures data integrity.

### Why there's no team/list route?

I decided, for navigation simplicity, to move the "list" visualization to them "team" route. It feels better to have the pages in the hyerarchy of the routes, and it's easier to navigate between them.
