// src/firebase/firestoreService.js
import { db } from './config'; // Asegúrate que esta ruta a firebaseConfig sea correcta
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

const reagentsCollection = collection(db, 'reagents');
const kardexCollection = collection(db, 'kardexMovements'); // Nombre de tu colección de movimientos de Kardex

// Función para añadir un nuevo reactivo
export const addReagent = async (reagentData) => {
    try {
        // Firebase genera el ID automáticamente al usar addDoc
        const docRef = await addDoc(reagentsCollection, {
            ...reagentData,
            createdAt: new Date(), // Opcional: añadir fecha de creación
        });
        console.log("Reactivo añadido con ID: ", docRef.id);
        return { id: docRef.id, ...reagentData }; // Retorna el reactivo con el ID de Firebase
    } catch (e) {
        console.error("Error añadiendo reactivo: ", e);
        throw new Error("No se pudo añadir el reactivo.");
    }
};

// Función para actualizar un reactivo existente
export const updateReagent = async (reagentData) => { // Ahora toma el objeto completo con ID
    try {
        const { id, ...dataToUpdate } = reagentData; // Extrae el ID y el resto de los datos
        if (!id) throw new Error("ID del reactivo es requerido para actualizar.");
        const reagentRef = doc(db, 'reagents', id);
        await updateDoc(reagentRef, dataToUpdate);
        console.log("Reactivo actualizado: ", id);
        return true;
    } catch (e) {
        console.error("Error actualizando reactivo: ", e);
        throw new Error("No se pudo actualizar el reactivo.");
    }
};

// Función para eliminar un reactivo
export const deleteReagent = async (id) => {
    try {
        // Primero, elimina los movimientos de Kardex asociados
        const q = query(kardexCollection, where("reagentId", "==", id));
        const querySnapshot = await getDocs(q);
        const deletePromises = [];
        querySnapshot.forEach((document) => {
            deletePromises.push(deleteDoc(doc(db, 'kardexMovements', document.id)));
        });
        await Promise.all(deletePromises);
        console.log(`Todos los movimientos de Kardex para el reactivo ${id} eliminados.`);

        // Luego, elimina el reactivo
        await deleteDoc(doc(db, 'reagents', id));
        console.log("Reactivo eliminado: ", id);
        return true;
    } catch (e) {
        console.error("Error eliminando reactivo o sus movimientos: ", e);
        throw new Error("No se pudo eliminar el reactivo o sus movimientos.");
    }
};

// Función para añadir un movimiento al Kardex
export const addMovement = async (movementData) => {
    try {
        const docRef = await addDoc(kardexCollection, {
            ...movementData,
            timestamp: new Date(), // Opcional: añadir un timestamp
        });
        console.log("Movimiento de Kardex añadido con ID: ", docRef.id);
        return { id: docRef.id, ...movementData }; // Retorna el movimiento con el ID de Firebase
    } catch (e) {
        console.error("Error añadiendo movimiento de Kardex: ", e);
        throw new Error("No se pudo añadir el movimiento de Kardex.");
    }
};

// ************************************************************
// *** A Q U Í   E S T Á   L A   F U N C I Ó N   F A L T A N T E ***
// ************************************************************
export const deleteMovement = async (movementId) => {
    try {
        await deleteDoc(doc(db, 'kardexMovements', movementId));
        console.log("Movimiento de Kardex eliminado: ", movementId);
        return true;
    } catch (e) {
        console.error("Error eliminando movimiento de Kardex: ", e);
        throw new Error("No se pudo eliminar el movimiento de Kardex.");
    }
};

// ... (otras funciones como getReagents, getKardexMovements si las tienes aquí)