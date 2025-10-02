export const formatValidateError = (errors) => {
    if(!errors || !errors.issues) return 'Validation falied';

    if(Array.isArray(errors.issues)) return errors.issues.map(issue => issue.message).join(', ');

    return JSON.stringify(errors);
};