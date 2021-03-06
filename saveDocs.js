import algoliaIndex from './algoliaIndex.js';
import formatPkg from './formatPkg.js';
import log from './log.js';
import npm from './npm.js';

export default function saveDocs(docs) {
  const rawPkgs = docs
    .filter(result => result.doc.name !== undefined) // must be a document
    .map(result => formatPkg(result.doc))
    .filter(pkg => pkg !== undefined);

  if (rawPkgs.length === 0) {
    log.info('🔍 No pkgs found in response.');
    return Promise.resolve();
  }

  return addMetaData(rawPkgs)
    .then(pkgs => algoliaIndex.saveObjects(pkgs))
    .then(() => log.info('🔍 Found and saved %d packages', rawPkgs.length));
}

function addMetaData(pkgs) {
  return npm.getDownloads(pkgs);
}
