const groupCache = new Map();

async function getGroupMetadata(conn, jid) {
  if (!jid.endsWith('@g.us')) return null;

  if (groupCache.has(jid)) {
    return groupCache.get(jid);
  }

  const metadata = await conn.groupMetadata(jid);
  groupCache.set(jid, metadata);

  setTimeout(() => groupCache.delete(jid), 5 * 60 * 1000);

  return metadata;
}

module.exports = { getGroupMetadata };

