// AppRouter.tsx
import {Routes, Route} from 'react-router-dom';
import {routesConfig} from "./routeConfig";
import MainMenu from "./MainMenu";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<MainMenu/>}>

      {routesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={<route.component/>}/>
      ))}
    </Route>

    {/* Redirect or default route */}
    <Route
      path="*"
      element={
        <main style={{padding: "1rem"}}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Routes>
);

export default AppRouter;
