
export const isAdmin  = () => {
    if (localStorage.getItem('nimdAis')) {
        return true;
    }

    return false;
}