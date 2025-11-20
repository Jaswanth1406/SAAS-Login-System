export function validateSignUp({name , email , password}){
    const errors = [];

    if(!name || name.length < 2) errors.push("Name must be at least 2 characters long");
    if(!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email format");
    if(!password || password.length < 6) errors.push("Password must be at least 6 characters long");

    return errors;
}
