const axios = require('axios');
const authString = "Basic " + Buffer.from("interop_pit:9U6S2MvAO1T78opNJYG2JVum29uIGvAOvxCJ").toString("base64");

const services = {
    1205: "Exam, emergency"
}

const getClaims = async (patientId) => {
    try {
        const response = await axios.get(
            `https://dvh6ztzc-carin.interopland.com/better-health-insurance/fhir/Claim?patient=${patientId}&_sort=-created`, 
            {
                headers: {
                    Authorization: authString
                }
            }
        );
        if (response.status == 200) {
            if (response.data.entry) {
                return formatClaims(response.data.entry);
            } else {
                return "You do not have claims."
            }
        } else {
            console.log(response.status);
            return "Try again";
        }
    } catch (error) {
        console.log(error);
        return "Try again";
    }
};

function formatClaims(claims) {
    let claimList = "Here are your claims: "
    claims.forEach(claim => {
        claimList = claimList + "Claim on " + claim.resource.created + ", ";
    });
    return claimList.slice(0, -2);
}

const getClaimDetails = async (patientId, createdDate) => {
    try {
        const response = await axios.get(
            `https://dvh6ztzc-carin.interopland.com/better-health-insurance/fhir/Claim?patient=${patientId}&created=${createdDate}`, 
            {
                headers: {
                    Authorization: authString
                }
            }
        );
        if (response.status == 200) {
            if (response.data.entry) {
                return formatClaimDetails(response.data.entry[0]);
            } else {
                return `You do not have a claim on ${createdDate}.`
            }
        } else {
            console.log(response.status);
            return "Try again";
        }
    } catch (error) {
        console.log(error);
        return "Try again";
    }
};

function formatClaimDetails(claim) {
    let claimDetails = "Here are your claim details: "
    claimDetails = claimDetails + "Claim on " + claim.resource.created 
        + " with " + claim.resource.provider.reference.replace("Organization/", "provider ");
    if (claim.resource.item) {
        claimDetails = claimDetails + " for service(s): ";
        claim.resource.item.forEach(item => {
            claimDetails = claimDetails + services[item.productOrService.coding[0].code] + ", ";
        });
    }
    return claimDetails.slice(0, -2);
}

module.exports = { getClaims, getClaimDetails };
