
import React from "react";
import { format } from "date-fns";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Package2 } from "lucide-react";

const Orders = () => {
  const { orders, isAuthenticated } = useShop();

  // Function to get the status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format date from ISO string
  const formatOrderDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Package2 size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to view your orders</h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to view your order history.
            </p>
            <Link to="/login">
              <Button className="bg-brand-600 hover:bg-brand-700">Login</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button className="bg-brand-600 hover:bg-brand-700">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Order #{order.id.toString().padStart(4, "0")}
                      </CardTitle>
                      <CardDescription>
                        Placed on {formatOrderDate(order.date)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="font-semibold text-brand-700">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.products.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden">
                                <img
                                  src={item.product.images[0] || "/placeholder.svg"}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="line-clamp-1">{item.product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.product.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-semibold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-semibold text-brand-700">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="p-4 border-t">
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Delivery Address:</p>
                      <p className="text-gray-700">{order.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Orders;
