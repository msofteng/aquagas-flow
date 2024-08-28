export default {
    NodeEnv: (process.env.NODE_ENV ?? ''),
    Port: (process.env.PORT ?? 0),
    CookieProps: {
        Key: 'ExpressGeneratorTs',
        Secret: (process.env.COOKIE_SECRET ?? ''),
        Options: {
            httpOnly: true,
            signed: true,
            path: (process.env.COOKIE_PATH ?? ''),
            maxAge: Number(process.env.COOKIE_EXP ?? 0),
            domain: (process.env.COOKIE_DOMAIN ?? ''),
            secure: (process.env.SECURE_COOKIE === 'true'),
        },
    },
    Jwt: {
        Secret: (process.env.JWT_SECRET ??  ''),
        Exp: (process.env.COOKIE_EXP ?? ''),
    },
} as const;