const axios = require('axios');

const getClaims = async (patientId) => {
    try {
        const response = await axios.get(
            `https://dvh6ztzc-carin.interopland.com/better-health-insurance/fhir/Claim?patient=${patientId}`, 
            {
                data: {},
                timeout: 20000,
                headers: {
                    Authorization: "Basic " + Buffer.from("interop_pit:9U6S2MvAO1T78opNJYG2JVum29uIGvAOvxCJ").toString("base64")
                }
            }
        );
        console.log(response.status);
        //return JSON.stringify(response);
        return patientId;    
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getClaims };
