export default {
    Base: '',
    Auth: {
        Base: '/auth',
        Login: '/login',
        Logout: '/logout',
    },
    Users: {
        Base: '/users',
        Get: '/all',
        Add: '/add',
        Update: '/update',
        Delete: '/delete/:id',
    },
    Aquagas: {
        Base: '',
        Upload: '/upload',
        Confirm: '/confirm',
        List: '/list'
    },
} as const;