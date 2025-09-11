// Get all non-admin, non-bot members
async function getNonAdmins(message) {
    if (!message.client) {
        console.error("getNonAdmins error: message.client is undefined");
        return [];
    }
    const groupMetadata = await message.client.groupMetadata(message.jid).catch(() => null);
    if (!groupMetadata) return [];
    const participants = groupMetadata.participants || [];
    const admins = participants.filter(p => p.admin !== null).map(p => p.id);
    return participants
        .map(p => p.id)
        .filter(id => !admins.includes(id) && id !== message.user);
}

// Superfast kick all non-admin members
async function kickAllMembers(message) {
    if (!message.client) {
        console.error("kickAllMembers error: message.client is undefined");
        return 0;
    }
    let totalKicked = 0;
    let errorCount = 0; // Track consecutive 403 errors

    while (true) {
        let toKick = await getNonAdmins(message);
        if (toKick.length === 0) break;

        // Split into batches of 5 but kick them in parallel
        const batchSize = 30;
        const batches = [];
        for (let i = 0; i < toKick.length; i += batchSize) {
            batches.push(toKick.slice(i, i + batchSize));
        }

        try {
            await Promise.all(batches.map(async (batch) => {
                try {
                    await message.client.groupParticipantsUpdate(message.jid, batch, "remove");
                    totalKicked += batch.length;
                    errorCount = 0; // Reset after success
                } catch (e) {
                    console.error(`❌ Failed to kick batch:`, batch, e?.message || e);
                    if (e?.output?.statusCode === 403 || String(e).includes("403")) {
                        errorCount++;
                        if (errorCount >= 30) {
                            throw new Error("🚫 5 consecutive 403 errors. Stopping kick process.");
                        }
                    }
                }
            }));
        } catch (stopErr) {
            console.error(stopErr.message || stopErr);
            break;
        }
    }

    return totalKicked;
}


module.exports = {
    kickAllMembers,
    getNonAdmins
};