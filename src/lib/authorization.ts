"use server";

function authorisation(email: string){
    if(email){
        return true;
    } else {
        return false;
    }
}

export default authorisation;