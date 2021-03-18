const axios = require('axios');
const authString = "Basic " + Buffer.from("interop_pit:9U6S2MvAO1T78opNJYG2JVum29uIGvAOvxCJ").toString("base64");

const getClaims = async (patientId) => {
    try {
        const response = await axios.get(
            `https://dvh6ztzc-carin.interopland.com/better-health-insurance/fhir/ExplanationOfBenefit?patient=${patientId}&_sort=-created`,
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
        claimList = claimList + "\n- On " + claim.resource.created.match(/\d{4}-\d{2}-\d{2}/) + " with " + claim.resource.provider.display + ", ";
    });
    return claimList.slice(0, -2);
}

const getClaimDetails = async (patientId, createdDate) => {
    try {
        const response = await axios.get(
            `https://dvh6ztzc-carin.interopland.com/better-health-insurance/fhir/ExplanationOfBenefit?patient=${patientId}&created=${createdDate}`, 
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
    let claimDetails = "Here are your claim details "
    claimDetails = claimDetails + "on " + claim.resource.created.match(/\d{4}-\d{2}-\d{2}/) 
        + " with provider " + claim.resource.provider.display;
    if (claim.resource.item) {
        claimDetails = claimDetails + " for product or service of ";
        claim.resource.item.forEach(item => {
            claimDetails = claimDetails + item.productOrService.coding[0].display + ", ";
        });
        claimDetails = claimDetails.slice(0, -2);
    }
    claimDetails = claimDetails + "with \nBilled Amount of $" + claim.resource.total[0].amount.value
        + "\nApproved Amount of $" + claim.resource.payment.amount.value;
    return claimDetails;
}

module.exports = { getClaims, getClaimDetails };

