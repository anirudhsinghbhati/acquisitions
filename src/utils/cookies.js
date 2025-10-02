export const cookieStore = {
    getOption: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15*60*1000 // 15 minutes
    }),
    set: (res, name, value, option = {}) => {
        res.cookie(name, value, { ...cookieStore.getOption(), ...option });
},
    clear: (res, name , option= {}) => {
        res.clearCookie(name, { ...cookieStore.getOption(), ...option });
    },
    get: (req, name) => {
        return req.cookies[name];
    }
}
export default cookieStore;
