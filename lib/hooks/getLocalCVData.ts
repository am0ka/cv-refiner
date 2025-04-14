import { CVData } from "../types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UseGetLocalCVData = {
    data: CVData | null,
    loading: boolean,
    setData: Dispatch<SetStateAction<CVData | null>>
}

// hook that gets the local CV data from localStorage
export const useGetLocalCVData: () => UseGetLocalCVData = () => {
    const [data, setData] = useState<CVData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem("cvData");
        if (storedData) {
            setData(JSON.parse(storedData));
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    return { data, loading, setData };
};