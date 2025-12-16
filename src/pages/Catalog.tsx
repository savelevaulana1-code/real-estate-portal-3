import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface Property {
  id: number;
  title: string;
  type: "apartment" | "house" | "commercial";
  operationType: "rent" | "buy";
  price: number;
  area: number;
  location: string;
  rooms?: number;
  image: string;
  description: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "Современная квартира в центре",
    type: "apartment",
    operationType: "buy",
    price: 8500000,
    area: 75,
    location: "Москва, ул. Тверская, 10",
    rooms: 3,
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/f486abb3-713f-4ef5-993d-7ee67318a353.jpg",
    description: "Просторная трёхкомнатная квартира с евроремонтом"
  },
  {
    id: 2,
    title: "Просторная квартира для аренды",
    type: "apartment",
    operationType: "rent",
    price: 85000,
    area: 65,
    location: "Москва, ул. Арбат, 25",
    rooms: 2,
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/f486abb3-713f-4ef5-993d-7ee67318a353.jpg",
    description: "Уютная двухкомнатная квартира в историческом центре"
  },
  {
    id: 3,
    title: "Загородный дом с участком",
    type: "house",
    operationType: "buy",
    price: 15000000,
    area: 200,
    location: "Московская обл., Одинцовский р-н",
    rooms: 5,
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/5c477559-fb5f-447d-b38a-cd2d362a938e.jpg",
    description: "Двухэтажный дом с садом и гаражом на 2 машины"
  },
  {
    id: 4,
    title: "Коттедж в аренду",
    type: "house",
    operationType: "rent",
    price: 150000,
    area: 180,
    location: "Московская обл., Рублёво",
    rooms: 4,
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/5c477559-fb5f-447d-b38a-cd2d362a938e.jpg",
    description: "Комфортабельный коттедж в элитном посёлке"
  },
  {
    id: 5,
    title: "Офисное помещение в бизнес-центре",
    type: "commercial",
    operationType: "buy",
    price: 25000000,
    area: 150,
    location: "Москва, Пресненская наб., 12",
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/998c0485-3a40-439b-a27f-3958ffc9d9af.jpg",
    description: "Офис класса А с панорамными окнами"
  },
  {
    id: 6,
    title: "Коммерческое помещение под магазин",
    type: "commercial",
    operationType: "rent",
    price: 200000,
    area: 120,
    location: "Москва, ул. Ленина, 45",
    image: "https://cdn.poehali.dev/projects/bb62b349-426f-4b42-b4c0-e9ac739308f4/files/998c0485-3a40-439b-a27f-3958ffc9d9af.jpg",
    description: "Помещение на первом этаже с отдельным входом"
  },
];

const Catalog = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterOperation, setFilterOperation] = useState<string>("all");

  const filteredProperties = properties.filter(prop => {
    const typeMatch = filterType === "all" || prop.type === filterType;
    const operationMatch = filterOperation === "all" || prop.operationType === filterOperation;
    return typeMatch && operationMatch;
  });

  const handlePropertyClick = (property: Property) => {
    sessionStorage.setItem('selectedProperty', JSON.stringify(property));
    navigate('/applications');
  };

  const propertyTypeLabels = {
    apartment: "Квартира",
    house: "Дом",
    commercial: "Коммерческая"
  };

  const operationTypeLabels = {
    rent: "Аренда",
    buy: "Покупка"
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="Building2" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Недвижимость.Realty</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition">Главная</Link>
            <Link to="/catalog" className="text-primary font-medium">Каталог</Link>
            <Link to="/applications" className="text-foreground hover:text-primary transition">Заявки</Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition">Контакты</Link>
          </nav>
          <Link to="/login">
            <Button variant="outline">Войти</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3">Каталог недвижимости</h2>
          <p className="text-muted-foreground mb-6">Выберите подходящий объект и оформите заявку</p>

          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Тип недвижимости" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="apartment">Квартиры</SelectItem>
                  <SelectItem value="house">Дома</SelectItem>
                  <SelectItem value="commercial">Коммерческая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select value={filterOperation} onValueChange={setFilterOperation}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Тип операции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все операции</SelectItem>
                  <SelectItem value="buy">Покупка</SelectItem>
                  <SelectItem value="rent">Аренда</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-scale animate-fade-in">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    className={property.operationType === "rent" ? "bg-accent" : "bg-primary"}
                  >
                    {operationTypeLabels[property.operationType]}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <Badge variant="outline">
                    {propertyTypeLabels[property.type]}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Icon name="Maximize2" size={16} className="text-muted-foreground" />
                    <span>{property.area} м²</span>
                  </div>
                  {property.rooms && (
                    <div className="flex items-center gap-1">
                      <Icon name="Home" size={16} className="text-muted-foreground" />
                      <span>{property.rooms} комн.</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">
                    {property.price.toLocaleString('ru-RU')} ₽
                    {property.operationType === "rent" && (
                      <span className="text-base font-normal text-muted-foreground">/мес</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePropertyClick(property)}
                >
                  Оформить заявку
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;