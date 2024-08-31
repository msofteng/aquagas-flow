import App from '@src/app';

import AuthRoutes from '@src/routes/auth';
import UserRoutes from '@src/routes/user';
import AquagasRoutes from './routes/aquagas';

const app = new App([
    new AuthRoutes(),
    new UserRoutes(),
    new AquagasRoutes()
]);

app.listen();

export default app;