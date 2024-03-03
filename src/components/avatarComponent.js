import React from 'react';
import HouseIcon from '@mui/icons-material/House';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SchoolIcon from '@mui/icons-material/School';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import RedeemIcon from '@mui/icons-material/Redeem';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PersonIcon from '@mui/icons-material/Person';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import CheckroomIcon from '@mui/icons-material/Checkroom';
// import DiningIcon from '@mui/icons-material/Dining';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import DeckIcon from '@mui/icons-material/Deck';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import MoneyIcon from '@mui/icons-material/Money';
import TvIcon from '@mui/icons-material/Tv';
import { AddCard, RequestQuote } from '@mui/icons-material';

export default function AvatarComponent(avatarType) {
  return (
    <div>
      {(() => {
        switch (avatarType) {
          case 'revenue':
            return <AttachMoneyIcon />;
          case 'essential_expenses':
            return <HouseIcon />;
          case 'health':
            return <LocalHospitalIcon />;
          case 'education':
            return <SchoolIcon />;
          case 'fuel':
            return <LocalGasStationIcon />;
          case 'supermarket':
            return <LocalGroceryStoreIcon />;
          case 'gifts':
            return <RedeemIcon />;
          case 'personal_cares':
            return <PersonIcon />;
          case 'work_expenses':
            return <AssuredWorkloadIcon />;
          case 'financing':
            return <MoneyOffIcon />;
          case 'leisure':
            return <DeckIcon />;
          case 'bars_and_restaurants':
            return <RestaurantMenuIcon />;
          case 'taxes_fees':
            return <ThumbDownAltIcon />;
          case 'uncategorized':
            return <DoNotDisturbAltIcon />;
          case 'maintence':
            return <EngineeringIcon />;
          case 'children':
            return <ChildCareIcon />;
          case 'cash':
            return <MoneyIcon />;
          case 'credit_card':
            return <AddCard />;
          case 'tv':
            return <TvIcon />;
          case 'stocks':
            return <RequestQuote />;
          case 'miscellaneous_purchases':
            return <LocalMallIcon />;
          default:
            return <DoNotDisturbAltIcon />;
        }
      })()}
    </div>
  );
}
