async function parseCustomData(textFileData) {
    const regex = /(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)\|(.*)$/gm;
    let rows = [];
    let m;

    while ((m = regex.exec(textFileData)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.shift();

        rows.push(m);
    }


    let header = rows.shift();
    let data = rows.map(row => {
        let hash = {};
        for (let i = 0; i < header.length; ++i) {
            hash[header[i]] = row[i];
        }
        return hash;
    });

    return data;

}



export { parseCustomData }
