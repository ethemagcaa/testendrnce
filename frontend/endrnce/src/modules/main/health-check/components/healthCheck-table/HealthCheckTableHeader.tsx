import React, { FC } from "react";
import { RefreshInterval } from "@components/refresh-interval/RefreshInterval";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@react-query/constants/query-keys";

const HealthCheckListHeader: FC = () => {
    const queryClient = useQueryClient();

    const handleTriggerMethod = async () => {
        await queryClient.invalidateQueries([queryKeys.healthCheckList]);
    };

    return (
        <div className='card-header border-0 pt-6'>
            <div className='d-flex align-items-center position-relative my-1'></div>
            <div className='card-toolbar'>
                <RefreshInterval
                    className={"me-3"}
                    triggerMethod={handleTriggerMethod}
                />
            </div>
        </div>
    );
};

export { HealthCheckListHeader };
