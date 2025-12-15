import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(funcUrls.auth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user.role !== 'admin') {
          toast({
            title: "Доступ запрещен",
            description: "У вас нет прав администратора",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Вход выполнен",
          description: `Добро пожаловать, ${data.user.name}!`,
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Ошибка входа",
          description: data.error || "Неверный email или пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить вход",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in border-blue-700 bg-blue-800/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Shield" className="text-white" size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Панель администратора</CardTitle>
          <CardDescription className="text-blue-200">Вход для администраторов Estate Manager</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-100">Email администратора</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@estate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-100">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="Shield" className="mr-2" size={16} />
                  Войти как администратор
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-200 hover:text-white inline-flex items-center gap-1">
              <Icon name="ArrowLeft" size={16} />
              На главную
            </Link>
          </div>
          <div className="mt-4 p-3 bg-blue-900/40 border border-blue-600/50 rounded-lg">
            <p className="text-xs text-blue-100 text-center">
              <Icon name="AlertTriangle" className="inline mr-1" size={14} />
              Только для авторизованного персонала
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;