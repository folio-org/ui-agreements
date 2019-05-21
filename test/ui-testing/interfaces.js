/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const Interfaces = [{
    name: `Content Provider ${generateNumber()}`,
    role: 'Content Provider',
    toDelete: true,
}, {
    name: `Vendor ${generateNumber()}`,
    role: 'Vendor',
    editedName: `Subscription Agent ${generateNumber()}`,
    editedRole: 'Subscription Agent',
}];