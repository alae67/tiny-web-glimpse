
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Gift, Search } from "lucide-react";

interface OrderFiltersProps {
  searchTerm: string;
  filterStatus: string;
  filterWinEligible: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onWinEligibleChange: (value: string) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  filterStatus,
  filterWinEligible,
  onSearchChange,
  onStatusChange,
  onWinEligibleChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Gift className="h-4 w-4 text-yellow-500" />
          <Select value={filterWinEligible} onValueChange={onWinEligibleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by win eligibility" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="eligible">With Win Eligible Products</SelectItem>
              <SelectItem value="not-eligible">No Win Eligible Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
