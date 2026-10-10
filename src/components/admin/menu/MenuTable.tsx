import Image from "next/image";
import PriceDisplay from "@/components/admin/PriceDisplay";
import type { MenuItemDTO } from "./types";

interface Props {
  items: MenuItemDTO[];
  deletingId: string | null;
  onEdit: (item: MenuItemDTO) => void;
  onDelete: (item: MenuItemDTO) => void;
}

export default function MenuTable({ items, deletingId, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <p className="p-6 text-sm text-gray-600">
        No menu items yet. Click &quot;Add menu item&quot; to create the first one.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
        <tr>
          <th className="p-3">Photo</th>
          <th className="p-3">Name</th>
          <th className="p-3">Category</th>
          <th className="p-3">Price</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-b border-gray-100 last:border-0">
            <td className="p-3">
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={64}
                  height={48}
                  className="h-12 w-16 rounded object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No photo</span>
              )}
            </td>
            <td className="p-3 font-medium text-gray-800">
              {item.name}
              {item.featured && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-normal text-amber-700">
                  Featured
                </span>
              )}
            </td>
            <td className="p-3 text-gray-700">{item.category || "-"}</td>
            <td className="p-3">
              <PriceDisplay price={item.price} discountPercent={item.discountPercent} />
            </td>
            <td className="p-3">
              <button
                onClick={() => onEdit(item)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item)}
                disabled={deletingId === item._id}
                className="text-red-600 hover:underline disabled:opacity-60"
              >
                {deletingId === item._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}