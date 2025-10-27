/**
 * Array of accounts to use for login feature
 * @type {[{password: string, id: number, email: string},{password: string, id: number, email: string},{password: string, id: number, email: string}]}
 */
export const accounts = [
    {
        id: 1,
        email: "test@t.ca",
        password: "123456Pw"
    },
    {
        id: 2,
        email: "jaden@mantie.ca",
        password: "Password123"
    },
    {
        id: 3,
        email: "griffin@kinley.ca",
        password: "Pa55w.rd"
    }
]

/**
 * Used for authenticating a user based on email and password
 * @param email an email for a user
 * @param password a password for a user
 * @returns {{id: number}} the id of the account that was logged in or 0 if no account matches
 * @authors Mantie7553, Kinley6573
 */
export const confirmAccount = (email,password) => {
    const accountInfo = {id:0};
    const account = accounts.find((account) => account.email === email && account.password === password);
    if (account) {
        accountInfo.id = account.id;
    }
    return accountInfo;
}