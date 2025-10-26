
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

export const confirmAccount = (email,password) => {
    const accountInfo = {id:0};
    const account = accounts.find((account) => account.email === email && account.password === password);
    if (account) {
        accountInfo.id = account.id;
    }
    return accountInfo;
}