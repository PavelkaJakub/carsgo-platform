import {PrismaClient,CompanyType,UserRole,VehicleStatus,LeadType} from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();

async function main(){
  await prisma.paymentEvent.deleteMany();await prisma.promotionOrder.deleteMany();await prisma.consentRecord.deleteMany();await prisma.emailVerificationToken.deleteMany();await prisma.passwordResetToken.deleteMany();await prisma.subscription.deleteMany();await prisma.savedSearch.deleteMany();await prisma.favorite.deleteMany();await prisma.auditLog.deleteMany();await prisma.lead.deleteMany();await prisma.vehiclePriceHistory.deleteMany();await prisma.vehicleImage.deleteMany();
  await prisma.importLog.deleteMany();await prisma.importFeed.deleteMany();await prisma.vehicle.deleteMany();
  await prisma.companyUser.deleteMany();await prisma.user.deleteMany();await prisma.company.deleteMany();

  const company=await prisma.company.create({data:{name:"Auto Praha Demo",type:CompanyType.DEALER,city:"Praha",region:"Hlavní město Praha",verified:true}});
  const partner=await prisma.user.create({data:{email:"partner@carsgo.local",passwordHash:await bcrypt.hash("carsgo123",10),role:UserRole.COMPANY_ADMIN,firstName:"Demo",lastName:"Partner"}});
  await prisma.companyUser.create({data:{userId:partner.id,companyId:company.id,role:"owner"}});
  await prisma.user.create({data:{email:"admin@carsgo.local",passwordHash:await bcrypt.hash("admin123",10),role:UserRole.ADMIN,firstName:"Carsgo",lastName:"Admin"}});

  const cars=[
    ["Škoda","Kodiaq","2.0 TDI DSG 4x4","SUV","Diesel","Automat",2021,70200,699900],
    ["Škoda","Octavia","2.0 TDI DSG Style","Kombi","Diesel","Automat",2020,98500,459900],
    ["Toyota","RAV4","2.5 Hybrid e-CVT","SUV","Hybrid","Automat",2021,63500,748900],
    ["BMW","320d","xDrive M Sport","Sedan","Diesel","Automat",2020,81000,799000]
  ];
  for(let i=0;i<cars.length;i++){
    const [brand,model,trim,bodyType,fuelType,transmission,year,mileage,price]=cars[i] as any[];
    const v=await prisma.vehicle.create({data:{companyId:company.id,externalId:`SEED-${i+1}`,brand,model,trim,bodyType,fuelType,transmission,year,mileage,price,status:VehicleStatus.ACTIVE,sourceType:"SEED",city:"Praha",region:"Hlavní město Praha"}});
    await prisma.vehiclePriceHistory.createMany({data:[{vehicleId:v.id,oldPrice:null,newPrice:price+20000,source:"SEED"},{vehicleId:v.id,oldPrice:price+20000,newPrice:price,source:"SEED"}]});
    await prisma.vehicleImage.create({data:{vehicleId:v.id,url:`https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80`,isPrimary:true}});
  }
  const first=await prisma.vehicle.findFirst({where:{companyId:company.id}});
  if(first)await prisma.lead.create({data:{vehicleId:first.id,companyId:company.id,type:LeadType.VEHICLE,name:"Jan Novák",email:"jan@example.cz",phone:"+420777111222",message:"Mám zájem o prohlídku.",status:"NEW"}});
  await prisma.importFeed.create({data:{companyId:company.id,type:"XML",url:"https://example.com/feed.xml",status:"ACTIVE"}});
}
main().finally(()=>prisma.$disconnect());
