import { deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getPageSections } from ".";
import { addDoc, collection, db } from "./firebase";

const frontCol = collection(db, "frontends");

export async function frontSections(key) {
    let section = await getPageSections(), imgCount = false, content = false;
    section = section[key];
    imgCount = section.content?.images;
    imgCount = imgCount ? Object.keys(imgCount).length : false;
    try {
        const snapshot = await getDocs(query(frontCol, where("data_keys", "==", key + '.content')));
        const doc = snapshot.docs[0]; content = {id: doc.id, ...doc.data()}; 
        content.data_values = JSON.parse(doc.data().data_values);
    } catch (error) {
        console.log('error:', error.message);
    }
    const pageTitle = section.name, emptyMessage = 'No item created yet.';

    const snapshot = await getDocs(query(frontCol, where("data_keys", "==", key + '.element')));
    let elements = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), data_values: JSON.parse(doc.data().data_values) }))

    return { section, content, elements, key, pageTitle, emptyMessage, imgCount }
}

export async function frontElement(key, id= false) {
    let section = await getPageSections(), data= false;
    section = section[key];
    if (!section) return null;
    delete section.element.modal;
    const pageTitle = section.name + ' Items';
    if (id) {
        try {
            data = await getDocs(query(frontCol, where("id", "==", id)));
            const doc = data.docs[0]; data = {id: doc.id, ...doc.data()};
            data.data_values = JSON.parse(data.data_values);
        } catch (error) {console.log('Error:', error);}
        return { section, key, pageTitle, data }
    } return { section, key, pageTitle}
}

export async function frontContent(req) {
    const { key, type, id, ...rest } = req;
    if (!type || !key) return null;

    const dataKey = `${key}.${type}`;
    const inputContentValue = {};

    // 1. Filter form fields, handle arrays like fieldName[]
    for (const [fieldName, value] of Object.entries(rest)) {
        if (await except_(fieldName, ['image_input', 'key', 'status', 'type', 'id'])) {
            const cleanKey = fieldName.endsWith('[]') ? fieldName.slice(0, -2) : fieldName;
            inputContentValue[cleanKey] = value;
        }
    }

    // 2. Attempt to load image field structure from config
    let imageFields = false;
    try {
        const sections = await getPageSections();
        imageFields = sections[key]?.[type]?.images || false;
    } catch {
        imageFields = false;
    }

    let docId = id;
    let existingData = null;

    // 3. If `id` is provided, fetch by Firestore document ID
    if (docId) {
        const docSnap = await getDocs(query(frontCol, where("id", "==", docId))); // legacy support
        if (!docSnap.empty) {
            const doc = docSnap.docs[0];
            docId = doc.id;
            existingData = JSON.parse(doc.data().data_values);
        }
    } else {
        // If no ID, try find matching content by data_keys (fallback)
        const contentQuery = query(frontCol, where("data_keys", "==", dataKey));
        const snapshot = await getDocs(contentQuery);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            docId = doc.id;
            existingData = JSON.parse(doc.data().data_values);
        }
    }

    // 4. Handle image merging logic
    if (imageFields) {
        for (const [imgKey] of Object.entries(imageFields)) {
            const uploadKey = `image_inputA${imgKey}Z`;
            const newImage = req[uploadKey];

            if (newImage) {
                inputContentValue[imgKey] = newImage;
            } else if (existingData?.[imgKey] && (id || type === 'content')) {
                inputContentValue[imgKey] = existingData[imgKey];
            } else {
                inputContentValue[imgKey] = '';
            }
        }
    }

    const date = new Date().toISOString();
    const finalData = JSON.stringify(inputContentValue);

    if (docId) {
        // ✅ Update existing document
        await updateDoc(doc(db, "frontends", docId), {
            data_values: finalData,
            updated_at: date,
        });
    } else {
        // ✅ Add new document
        await addDoc(frontCol, {
            data_keys: dataKey,
            data_values: finalData,
            created_at: date,
            updated_at: date,
        });
    }

    return { message: 'Content has been updated.' };
}


export async function frontContent2(req) {
    const key = req.key;
    const valInputs = req;
    const inputContentValue = {};
    for (const [keyName, input] of Object.entries(valInputs)) {
        if (await except_(keyName, ['image_input', 'key', 'status', 'type', 'id'])) {
            if (keyName.endsWith('[]')) {
                inputContentValue[keyName.slice(0, -2)] = req[keyName];
            } else {
                inputContentValue[keyName] = input;
            }
        }
    }
    const type = req.type;
    if (!type) return null;
    let imgJson;
    try {
        imgJson = await getPageSections()
        imgJson = imgJson[key][type]?.images || false;
    } catch (error) {
        imgJson = false;
    }

    let contentD, content, is_new;
    if (req.id) {
        contentD = await getDocs(query(frontCol, where("id", "==", req.id)));
        const doc = contentD.docs[0]; content = {id: doc.id, ...doc.data()};
        content.data_values = JSON.parse(content.data_values);
    } else {
        contentD = await getDocs(query(frontCol, where("data_keys", "==", `${key}.${type}`)));
        if (!contentD.empty) {
            const doc = contentD.docs[0]; content = {id: doc.id, ...doc.data()};
            content.data_values = JSON.parse(content.data_values);
        } else { content = null }
        if (content===null || type === 'element') {
            is_new = {data_keys: `${key}.${type}`, data_values: null};
        }
    }
    if (imgJson) {
        for (const [imgKey, imgValue] of Object.entries(imgJson)) {
            const imgData = req[`image_inputA${imgKey}Z`] ? req[`image_inputA${imgKey}Z`] : null;
            if (imgData) {
                try {
                    // const oldImage = is_new ? null : content?.data_values?.[imgKey];
                    inputContentValue[imgKey] = imgData;
                } catch (error) {
                    return {error: 'Could not upload the image.'}
                }
            } else if (content?.data_values?.[imgKey] && req?.id) {
                inputContentValue[imgKey] = content.data_values[imgKey];
            } else if (content?.data_values?.[imgKey] && type === 'content') {
                inputContentValue[imgKey] = content.data_values[imgKey];
            } else {
                inputContentValue[imgKey] = '';
            }
        }
    }
    const date = new Date().toISOString();
    if (is_new){
        is_new.data_values = JSON.stringify(inputContentValue);
        await addDoc(frontCol, { ...is_new, created_at: date, updated_at: date });
    }else{
        const value = JSON.stringify(inputContentValue);
        const cond = req?.id ? where("id", "==", `${req.id}`) : where("data_keys", "==", `${key}.${type}`);
        const snapshot = await getDocs(query(frontCol, cond));
        if (!snapshot.empty) {
            const docs = snapshot.docs[0];
            await updateDoc(doc(db, "frontends", docs.id), { data_values: value, updated_at: date });
        }
    }
    return {message: 'Content has been updated.'};
}
 
export async function removeElement(req) {
    const id = req.id;
    try {
        await deleteDoc(doc(db, "frontends", id));
        return { message: 'Content has been removed.' };
    } catch (error) {
        return { error: 'Content not found.' };
    }
}

const except_ = async (key, arrs = []) => {
    for (const arr of arrs) {
        if (key.startsWith(arr) && key !== 'keywords')
        return false;
    }
    return true;
}