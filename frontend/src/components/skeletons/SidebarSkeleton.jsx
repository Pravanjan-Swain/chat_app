import { Users } from "lucide-react";

function SidebarSkeleton() {
    const skeletonContancts = Array(8).fill(null);
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
            </div>

            {/* skeletonContancts */}
            <div className="overflow-y-auto w-full py-3">
                {skeletonContancts.map((_, idx) => {
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar Skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>

                        {/* User infor skeleton - only visible on larger screens */}
                        <div className="hidden l:block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                })}
            </div>
        </aside>
    )
}

export default SidebarSkeleton;