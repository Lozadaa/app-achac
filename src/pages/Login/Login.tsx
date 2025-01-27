import { IonButton, IonContent, IonPage, IonSpinner, IonText } from "@ionic/react"
import { useForm } from "react-hook-form";
import Logo from '@/assets/logo.png';
import { FormInput } from '@/components/FormInput/FormInput';
import './Login.css';
import { useEffect, useState } from "react";
import { axiosStandalone } from "@/utils/axios";
import { ResponseAuth, RequestState, UserResponse } from "@/types/Auth";
import { Preferences } from "@capacitor/preferences";

export type LoginFormData = {
  email: string;
  password: string;
}

const Login = () => {
  const { control, handleSubmit, watch } = useForm<LoginFormData>();
  const [request, setRequest] = useState<RequestState>('idle');
  const isLoading = request === 'loading';

  const onSubmit = async (user: LoginFormData) => {
    setRequest('loading');
    
    try{
      const {data: response, headers} = await axiosStandalone.post<ResponseAuth<{user: UserResponse}>>('/login', {user});
      
      if(response.status.data){
        await Preferences.set({
          key: 'user', value: JSON.stringify({...response.status.data.user, token: headers['authorization']})
        });
        window.location.href = '/home';
      }
    }catch(error: any){
      if(error.status === 401){
        setRequest('error');
        return;
      }

      setRequest('server_error');

      console.error(error);
      return;
    }

    setRequest('success');
  }

  useEffect(() => {
    setRequest('idle');
  }, [watch('email'), watch('password')]);

  return (
    <IonPage>
      <IonContent>
        <div className="login bg-black">
          <img className="login__logo" src={Logo} alt="Logo" />
          <div className="login__titles">
            <IonText className="login__title">Ingresar</IonText>
            <IonText className="login__subtitle">
              Inicio de sesión para <span className="login__subtitle--green">profesores</span>
            </IonText>
          </div>
          <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
            <FormInput<LoginFormData>
              name="email"
              control={control}
              placeholder="Correo electrónico"
              className="input"
              label="Correo electrónico"
              rules={{ 
                required: 'El usuario es requerido',
                minLength: {
                  value: 3,
                  message: 'El usuario debe tener al menos 3 caracteres'
                }
              }}
            />
            <FormInput<LoginFormData>
              name="password"
              control={control}
              type="password"
              placeholder="Contraseña"
              className="input"
              label="Contraseña"
              rules={{ 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              }}
            />
            {request === 'error' && <div className="login__alert">
               <IonText color="danger">Usuario o contraseña incorrectos</IonText>
            </div>}
            {request === 'server_error' && <div className="login__alert">
               <IonText color="danger">Ha ocurrido un error en la conexión</IonText>
            </div>}
            <IonButton 
              className="login__button" 
              expand="block" 
              fill="solid" 
              type="submit"
              disabled={isLoading}
            >
              Ingresar {isLoading && <IonSpinner name="crescent" />}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login 