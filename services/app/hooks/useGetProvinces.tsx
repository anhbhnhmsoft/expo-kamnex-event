import { useQuery } from '@tanstack/react-query';
import commonAPI from '@/services/app/api';
import { useState, useMemo } from 'react';

const useGetProvinces = () => {
    const [districtCode, setDistrictCode] = useState<string>('');
    const [wardCode, setWardCode] = useState<string>('');

    // provinces luôn load
    const queryProvince = useQuery({
        queryKey: ['commonAPI-province'],
        queryFn: () => commonAPI.province(),
        select: (res) => res.data,
    });

    // districts phụ thuộc districtCode
    const queryDistrict = useQuery({
        queryKey: ['commonAPI-district', districtCode],
        queryFn: () => commonAPI.district(districtCode),
        enabled: !!districtCode,
        select: (res) => res.data,
    });

    // wards phụ thuộc wardCode
    const queryWard = useQuery({
        queryKey: ['commonAPI-ward', wardCode],
        queryFn: () => commonAPI.ward(wardCode),
        enabled: !!wardCode,
        select: (res) => res.data,
    });

    // map data
    const provinces = useMemo(
        () =>
            queryProvince.data?.map((p) => ({ label: p.name, value: p.code })) || [],
        [queryProvince.data]
    );

    const districts = useMemo(
        () =>
            queryDistrict.data?.map((d) => ({ label: d.name, value: d.code })) || [],
        [queryDistrict.data]
    );

    const wards = useMemo(
        () =>
            queryWard.data?.map((w) => ({ label: w.name, value: w.code })) || [],
        [queryWard.data]
    );

    // loading
    const loadingProvince =
        queryProvince.isLoading || queryProvince.isFetching || queryProvince.isRefetching;
    const loadingDistrict =
        queryDistrict.isLoading || queryDistrict.isFetching || queryDistrict.isRefetching;
    const loadingWard =
        queryWard.isLoading || queryWard.isFetching || queryWard.isRefetching;

    return {
        provinces,
        districts,
        wards,
        loadingProvince,
        loadingDistrict,
        loadingWard,
        setDistrictCode, // khi gọi sẽ tự fetch district
        setWardCode, // khi gọi sẽ tự fetch ward
    };
};

export default useGetProvinces;
