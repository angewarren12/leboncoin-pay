
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PaymentNotification from "./pages/PaymentNotification";
import AddressConfirmation from "./pages/AddressConfirmation";
import CardConfirmation from "./pages/CardConfirmation";
import BankConfirmation from "./pages/BankConfirmation";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/payment-notification" element={<PaymentNotification />} />
          <Route path="/address-confirmation" element={<AddressConfirmation />} />
          <Route path="/card-confirmation" element={<CardConfirmation />} />
          <Route path="/bank-confirmation" element={<BankConfirmation />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
