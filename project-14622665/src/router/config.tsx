import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Home from "@/pages/home/page";
import NotFound from "@/pages/NotFound";
import AdminGuard from "@/components/AdminGuard";
import RequireAuth from "@/components/RequireAuth";

// Lazy-load tất cả các trang phụ để tách bundle — chỉ trang chủ (Home)
// được import tĩnh nhằm đảm bảo lần hiển thị đầu tiên nhanh nhất.
const MysticMirror = lazy(() => import("@/pages/explore/mystic-mirror/page"));
const TarotTable = lazy(() => import("@/pages/explore/tarot-table/page"));
const MoonWindow = lazy(() => import("@/pages/explore/moon-window/page"));
const Numerology = lazy(() => import("@/pages/explore/numerology/page"));
const MysticProfile = lazy(() => import("@/pages/my-profile/page"));
const MysticCard = lazy(() => import("@/pages/mystic-card/page"));
const CustomizeAura = lazy(() => import("@/pages/customize-aura/page"));
const ThietKeVong = lazy(() => import("@/pages/thiet-ke-vong/page"));
const ThanhToan = lazy(() => import("@/pages/thanh-toan/page"));
const Blog = lazy(() => import("@/pages/blog/page"));
const BlogPost = lazy(() => import("@/pages/blog/post/page"));
const About = lazy(() => import("@/pages/about/page"));
const Auth = lazy(() => import("@/pages/auth/page"));
const ChinhSachBaoMat = lazy(() => import("@/pages/chinh-sach-bao-mat/page"));
const DieuKhoanDichVu = lazy(() => import("@/pages/dieu-khoan-dich-vu/page"));
const ChinhSachHoanTien = lazy(() => import("@/pages/chinh-sach-hoan-tien/page"));
const AdminDashboard = lazy(() => import("@/pages/admin/page"));
const AdminEditor = lazy(() => import("@/pages/admin/editor/page"));
const AdminUsers = lazy(() => import("@/pages/admin/users/page"));
const AdminUserDetail = lazy(() => import("@/pages/admin/users/detail/page"));
const AdminVouchers = lazy(() => import("@/pages/admin/vouchers/page"));
const AdminOrders = lazy(() => import("@/pages/admin/orders/page"));
const AdminEmail = lazy(() => import("@/pages/admin/email/page"));

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  {
    path: "/explore/mystic-mirror",
    element: (
      <RequireAuth>
        <MysticMirror />
      </RequireAuth>
    ),
  },
  {
    path: "/explore/tarot-table",
    element: (
      <RequireAuth>
        <TarotTable />
      </RequireAuth>
    ),
  },
  {
    path: "/explore/moon-window",
    element: (
      <RequireAuth>
        <MoonWindow />
      </RequireAuth>
    ),
  },
  {
    path: "/explore/numerology",
    element: (
      <RequireAuth>
        <Numerology />
      </RequireAuth>
    ),
  },
  {
    path: "/my-profile",
    element: (
      <RequireAuth>
        <MysticProfile />
      </RequireAuth>
    ),
  },
  { path: "/mystic-card", element: <MysticCard /> },
  { path: "/customize-aura", element: <CustomizeAura /> },
  {
    path: "/thiet-ke-vong",
    element: (
      <RequireAuth>
        <ThietKeVong />
      </RequireAuth>
    ),
  },
  {
    path: "/thanh-toan",
    element: (
      <RequireAuth>
        <ThanhToan />
      </RequireAuth>
    ),
  },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/about", element: <About /> },
  { path: "/auth", element: <Auth /> },
  { path: "/chinh-sach-bao-mat", element: <ChinhSachBaoMat /> },
  { path: "/dieu-khoan-dich-vu", element: <DieuKhoanDichVu /> },
  { path: "/chinh-sach-hoan-tien", element: <ChinhSachHoanTien /> },
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminDashboard />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/editor",
    element: (
      <AdminGuard>
        <AdminEditor />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/editor/:id",
    element: (
      <AdminGuard>
        <AdminEditor />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminGuard>
        <AdminUsers />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/users/:id",
    element: (
      <AdminGuard>
        <AdminUserDetail />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/vouchers",
    element: (
      <AdminGuard>
        <AdminVouchers />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <AdminGuard>
        <AdminOrders />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/email",
    element: (
      <AdminGuard>
        <AdminEmail />
      </AdminGuard>
    ),
  },
  { path: "*", element: <NotFound /> },
];

export default routes;