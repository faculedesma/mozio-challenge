[![Deployment Pipeline](https://github.com/faculedesma/mozio-challenge/actions/workflows/pipeline.yml/badge.svg)](https://github.com/faculedesma/mozio-challenge/actions/workflows/pipeline.yml)

<a href="https://www.mozio.com/en-us/" rel="noopener" target="_blank"><img width="150" src="public/mozio-logo.svg" alt="mozio-logo"></a>

## Project Description :mountain_snow:

User-friendly travel planner application with the following features:

1. **Destination Selection**: Users should be able to choose at least two destinations from a list. Origin and end destinations always will be present.

2. **Passenger Input**: Users should be able to input the number of passengers who will be traveling.

3. **Date Selection**: Users should be able to select the date of travel.

4. **Kilometers Calculation**: Display the distance in kilometers between the selected destinations. Additionally, show the total distance of the entire travel itinerary.

## Technology Stack :fire:

You will be using the following technologies to build the travel planner:

<br>
<br>

<div style="display:inline-block">
<a href="https://react.dev/">
<img width="50" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="react-logo" />
</a>
<a href="https://www.typescriptlang.org/">
<img width="50" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" alt="typescript-logo" />
</a>
<a href="https://vitejs.dev/">
<img width="50" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1039px-Vitejs-logo.svg.png" alt="vite-logo" />
</a>
<a href="https://www.radix-ui.com/">
<img width="50" src="https://avatars.githubusercontent.com/u/75042455?s=280&v=4" alt="radix-logo" />
</a>
<a href="https://tailwindcss.com/">
<img width="60" src="https://avatars.githubusercontent.com/u/67109815?s=280&v=4" alt="tailwind-logo" />
</a>
<a href="https://jestjs.io/">
<img width="50" src="https://cdn.iconscout.com/icon/free/png-256/free-jest-3521517-2945020.png" alt="jest-logo" />
</a>
</div>

<br>
<br>

- **React**: A popular JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that provides static typing and improves code quality.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Vite**: A fast and lightweight development server and build tool.
- **Radix UI**: A collection of accessible and composable React components.
- **Jest**: A JavaScript testing framework for unit testing your code.

## Getting Started

To get started with the coding challenge, follow these steps:

1. Clone the repo
   ```sh
   git clone git@github.com:faculedesma/mozio-challenge.git
   ```
2. Install npm packages
   ```sh
   npm install
   ```
3. Run the application in development mode
   ```sh
   npm run dev
   ```

This will start the development server, and you can view the app at http://localhost:5173 in your browser.

## UI/UX

Followed this figma prototype:

<div class="display:inline-block">
   <a href="https://www.figma.com/file/GSIB3ruHqfmv2Rubs4wK6J/?type=design&node-id=119-2499&mode=design&t=X5d7zOYCGiTKSzvG-0">
   <img width="50" src="https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png?w=804&h=804&q=75&fit=max&auto=format" alt="tailwind-logo" />
   </a>
</div>

## Additional considerations

- Origin and end destinations should always be selected. Intermediate destinations can be added in between.

- The default value for the number of passengers is set to 1. f the user doesn't change this value, the default value will be used to display results. As a result, the user can't select a value lower than one, and no error message needs to be displayed.

- The default value for the travel date is set to today. If the user doesn't change this value, the default value will be used to display results.

- The travel date cannot be earlier than today or more than one year in the future.

- I have made a few changes to the UI based on my personal preferences, as I believe they enhance the visual appeal and user experience.

- I have made a few changes to the UI based on my personal preferences, as I believe they enhance the visual appeal and improve the user experience.

## Contact

Facundo Ledesma - faculedesma1993@gmail.com
