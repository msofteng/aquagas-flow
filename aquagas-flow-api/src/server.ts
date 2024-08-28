import App from '@src/app';

import AuthRoutes from '@src/routes/AuthRoutes';
import UserRoutes from '@src/routes/UserRoutes';

const app = new App([
    new AuthRoutes(),
    new UserRoutes()
]);

app.listen();

export default app;