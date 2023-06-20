import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { doc, deleteDoc, onSnapshot, collection, addDoc, query, where, updateDoc, getDoc, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import db from "./firebase";

export interface Items {
    [key: string]: any,
    name: string,
    quantity: string, 
    price: string,
    amount: string
}

export interface Product {
    id: string,
    category: string,
    price: number,
    quantity: string,
    name: string
}

export interface ProductItem {
 price: number,
  amount: string,
  quantity: string,
  name: string,
}
export interface Sales{
  customerEmail: string,
  customerName: string,
  id: string,
  totalAmount: number,
  timestamp: {
	  seconds: number;
	  nanoseconds: number;
  },
  products: ProductItem[]
}

export function calculateTotalAmount(objectsArray: Items[]) {
  let totalAmount = 0;

  for (let i = 0; i < objectsArray.length; i++) {
      const stringAmount = objectsArray[i].amount
      const amount = Number(stringAmount.replace(/,/g, ""))
      totalAmount += amount
  }

  return totalAmount;
}
export const separateString = (inputString: string) => {
  const separatorIndex = inputString.indexOf("-");
  if (separatorIndex !== -1) {
    const firstPart = inputString.substring(0, separatorIndex);
    const secondPart = inputString.substring(separatorIndex + 1);
    return [firstPart, secondPart];
  } else {
    return [];
  }
}

export const generateNumbersArray = (number: number) => {
  const array = [];
  for (let i = 1; i <= number; i++) {
    array.push(i);
  }
  array.sort((a, b) => a - b);
  return array;
}

export const successMessage = (message:string) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};
export const errorMessage = (message:string) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const LoginUser = (email: string, password: string, router: AppRouterInstance) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            successMessage("Authentication successful 🎉");
            router.push("/dashboard");
        })
        .catch((error) => {
            console.error(error);
            errorMessage("Incorrect Email/Password ❌");
        });
};

export const LogOut = (router: AppRouterInstance) => {
	signOut(auth)
		.then(() => {
			successMessage("Logout successful! 🎉");
			router.push("/");
		})
		.catch((error) => {
			errorMessage("Couldn't sign out ❌");
		});
};

export const getCategories = async (setCategories: any) => {
	try {
        const unsub = onSnapshot(collection(db, "categories"), doc => {
            const docs: any = []
            doc.forEach((d: any) => {
              docs.push( { ...d.data(), id: d.id })
            });
			setCategories(docs)
        }) 
	} catch (err) {
		console.error(err)
		setCategories([])
	}
}
export const deleteCategory =  async (id: string, name:string) => {
	try {
		await deleteDoc(doc(db, "categories", id));
		const q = query(collection(db, "products"), where("category", "==", name));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			querySnapshot.forEach((document) => {
				deleteDoc(doc(db, "products", document.id));
			});
		});
		successMessage(`${name} category deleted 🎉`)
	} catch (err) {
		errorMessage("Encountered an error ❌")
		console.log(err)
	}

}

export const addCategory = async (name: string) => {
	try {
		await addDoc(collection(db, "categories"), {
			name, number_of_products: 0
		})
		successMessage(`${name} category added! 🎉`)
	} catch (err) {
		errorMessage("Error! ❌")
		console.error(err)
}
}

export const addProduct = async (name: string, price: number, category: string) => {
	try {
		const categoryDetails = separateString(category)
		await addDoc(collection(db, "products"), {
			name, price, category: categoryDetails[0]
		})
		const docRef = doc(db, "categories", categoryDetails[1]);
		const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const categoryData = docSnap.data()
		const categoryNumber = categoryData.number_of_products
		const updatedValue = categoryNumber + 1

		const categoryRef = doc(db, "categories", categoryDetails[1]);
		await updateDoc(categoryRef, { number_of_products: updatedValue });
		successMessage(`${name} product added! 🎉`)
	} else {
  			errorMessage("Error! Try again ❌")
	}		
		
	} catch (err) {
		errorMessage("Error! ❌")
		console.error(err)
}
}

export const getProducts = async (setProducts: any) => {
	try {
        const unsub = onSnapshot(collection(db, "products"), doc => {
            const docs: any = []
            doc.forEach((d: any) => {
              docs.unshift( { ...d.data(), id: d.id })
            });
			setProducts(docs)
        }) 
	} catch (err) {
		console.error(err)
		setProducts([])
	}
}
export const deleteProduct =  async (id: string, name:string) => {
	try {
		await deleteDoc(doc(db, "products", id));
		successMessage(`${name} deleted 🎉`)
	} catch (err) {
		errorMessage("Encountered an error ❌")
		console.log(err)
	}

}

export const addSales = async (customerName: string, customerEmail: string, products: Items[], totalAmount: number, setAddNew: any) => {
	try {
		await addDoc(collection(db, "sales"), {
			customerName, customerEmail, products, totalAmount, timestamp: serverTimestamp()
		})
		successMessage("Sales recorded! 🎉")
		setAddNew(false)

	} catch (err) {
		console.error(err)
		errorMessage("Error! Try again ❌")
	}
}

export const getSales = async (setSales: any) => {
try {
	const docRef = collection(db, "sales")
	const q = query(docRef, orderBy("timestamp"))
	onSnapshot(q, (snapshot) => {
		const docs: any = []
            snapshot.forEach((d: any) => {
              docs.unshift( { ...d.data(), id: d.id })
			});
		setSales(docs)
	})	
	} catch (err) {
		console.error(err)
		setSales([])
	}
}

export const getTotalSales = async (setTotalSales: any) => {
try {
        const unsub = onSnapshot(collection(db, "sales"), doc => {
            let totalSales:number = 0
            doc.forEach((d: any) => {
              totalSales += d.data().totalAmount
            });
			setTotalSales(totalSales)
        }) 
	} catch (err) {
	console.error(err)
	}
}

export const getSalesForDay = async (date: Date | null, setSales: any) => {
	try {
		const day = date?.getDate()
		const month = date?.getMonth()
		const year: number | undefined = date?.getFullYear()

		if (day !== undefined && month !== undefined && year !== undefined) {
			const startDate = new Date(year, month, day, 0, 0, 0);
			const endDate = new Date(year, month, day, 23, 59, 59);

			const docRef = collection(db, "sales")
			const q = query(docRef, orderBy("timestamp"), where("timestamp", ">=", Timestamp.fromDate(startDate)), where("timestamp", "<=", Timestamp.fromDate(endDate)))

			onSnapshot(q, (snapshot) => {
				const docs: any = []
				snapshot.forEach((d: any) => {
				docs.unshift( { ...d.data(), id: d.id })
				});
				setSales(docs)
		})
		}
		
	 }
	catch (err) {
		console.error(err)
	}
}