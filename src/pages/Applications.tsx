import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import funcUrls from "../../backend/func2url.json";

const Applications = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  });
  const [operationType, setOperationType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  useEffect(() => {
    const savedProperty = sessionStorage.getItem('selectedProperty');
    if (savedProperty) {
      const property = JSON.parse(savedProperty);
      setOperationType(property.operationType);
      setPropertyType(property.type);
      setArea(property.area.toString());
      setFormData(prev => ({
        ...prev,
        location: property.location,
        description: property.description,
      }));
      setEstimatedValue(property.price);
      sessionStorage.removeItem('selectedProperty');
    }
  }, []);

  const calculateEstimate = () => {
    if (!area || !propertyType || !operationType) return;

    const basePrice = {
      apartment: 100000,
      house: 150000,
      commercial: 200000,
      land: 50000
    }[propertyType] || 100000;

    const multiplier = operationType === "rent" ? 0.01 : 1;
    const calculated = basePrice * parseFloat(area) * multiplier;
    
    setEstimatedValue(Math.round(calculated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!estimatedValue) {
      toast({
        title: "Ошибка",
        description: "Сначала рассчитайте оценку",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(funcUrls.applications, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          operation_type: operationType,
          property_type: propertyType,
          area: parseFloat(area),
          location: formData.location,
          description: formData.description,
          estimated_value: estimatedValue,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Заявка отправлена",
          description: "Наш менеджер свяжется с вами в ближайшее время",
        });
        
        setFormData({
          name: "",
          email: "",
          phone: "",
          location: "",
          description: "",
        });
        setOperationType("");
        setPropertyType("");
        setArea("");
        setEstimatedValue(null);
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось отправить заявку",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="Building2" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Недвижимость.Realty</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition">Главная</Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition">Каталог</Link>
            <Link to="/applications" className="text-primary font-medium">Заявки</Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition">Контакты</Link>
          </nav>
          <Link to="/login">
            <Button variant="outline">Войти</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3">Оформление заявки</h2>
            <p className="text-muted-foreground">Заполните форму для получения оценки недвижимости</p>
          </div>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Информация о недвижимости</CardTitle>
              <CardDescription>Все поля обязательны для заполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ФИО</Label>
                    <Input 
                      id="name" 
                      placeholder="Иванов Иван"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operationType">Тип операции</Label>
                    <Select value={operationType} onValueChange={(value) => {
                      setOperationType(value);
                      setEstimatedValue(null);
                    }} required>
                      <SelectTrigger id="operationType">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">Аренда</SelectItem>
                        <SelectItem value="buy">Покупка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Тип недвижимости</Label>
                    <Select value={propertyType} onValueChange={(value) => {
                      setPropertyType(value);
                      setEstimatedValue(null);
                    }} required>
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="commercial">Коммерческая</SelectItem>
                        <SelectItem value="land">Земля</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Площадь (м²)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="100"
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        setEstimatedValue(null);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Местоположение</Label>
                    <Input 
                      id="location" 
                      placeholder="Москва, ул. Ленина"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите дополнительные характеристики объекта"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calculateEstimate}
                    className="flex-1"
                  >
                    <Icon name="Calculator" className="mr-2" size={18} />
                    Рассчитать оценку
                  </Button>
                  <Button type="submit" className="flex-1">
                    Отправить заявку
                  </Button>
                </div>

                {estimatedValue && (
                  <Card className="bg-accent/10 border-accent animate-scale-in">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Предварительная оценка</p>
                        <p className="text-3xl font-bold text-accent">
                          {estimatedValue.toLocaleString('ru-RU')} ₽
                          {operationType === "rent" && <span className="text-lg">/мес</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Applications;