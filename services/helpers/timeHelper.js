const timeHelper = (value, length) => {
    // This generates a length of time in seconds
    let calculated;
    switch (length) {
        case 'second':
        case 'seconds':
            calculated = value;
            break;

        case 'minute':
        case 'minutes':
            calculated =  60 * value;
            break;
    
        case 'hour':
        case 'hours':
            calculated = 60 * 60 * value;
            break;
        
        case 'day':
        case 'days':
            calculated = 60 * 60 * 24 * value;
            break;
    }
    return calculated;
}

module.exports = timeHelper;