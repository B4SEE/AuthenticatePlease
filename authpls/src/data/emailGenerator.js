import {
    validSubjects,
    validBodies,
    validDomains,
    validActions,
    phishingSubjects,
    phishingBodies,
    phishingDomains,
    phishingActions,
} from "./emailParts";

export const generateEmail = () => {
    const isPhishing = Math.random() < 0.5;
    if (isPhishing) {
        const subject = phishingSubjects[Math.floor(Math.random() * phishingSubjects.length)];
        const body = phishingBodies[Math.floor(Math.random() * phishingBodies.length)];
        const domain = phishingDomains[Math.floor(Math.random() * phishingDomains.length)];
        const from = `support@${domain}`;
        const action = phishingActions[Math.floor(Math.random() * phishingActions.length)];
        return { subject, from, body, isPhishing: true, action };
    } else {
        const subject = validSubjects[Math.floor(Math.random() * validSubjects.length)];
        const body = validBodies[Math.floor(Math.random() * validBodies.length)];
        const domain = validDomains[Math.floor(Math.random() * validDomains.length)];
        const from = `hr@${domain}`;
        const action = validActions[Math.floor(Math.random() * validActions.length)];
        return { subject, from, body, isPhishing: false, action };
    }
};