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