<a href="https://www.gotoiot.com/">
    <img src="doc/gotoiot-logo.png" alt="logo" title="Goto IoT" align="right" width="60" height="60" />
</a>

Web App Full Stack Base
=======================

*Ayudaría mucho si apoyaras este proyecto con una ⭐ en Github!*

Este proyecto es una aplicación web fullstack que se ejecuta sobre el ecosistema `Docker`. Está compuesta por un compilador de `TypeScript` que te permite utilizar este superset de JavaScript para poder programar un `cliente web`. También tiene un servicio en `NodeJS` que te permite ejecutar código en backend y al mismo tiempo disponibilizar el código del cliente web para interactar con el servicio. Además tiene una `base de datos` MySQL que puede interactuar con el backend para guardar y consultar datos, y de manera adicional trae un `administrador` de base de datos para poder administrar la base en caso que lo necesites.

La aplicación IoT de base que viene con este proyecto se encarga de crear una tabla llamada `Devices` en la base de datos, y la idea es que vos puedas desarrollar el código de backend y frontend que te permita controlar desde el navegador el estado de los devices de un hogar inteligente - *como pueden ser luces, TVs, ventiladores, persianas, enchufes y otros* - y almacenar los estados de cada uno en la base de datos. 

Realizando estas tareas vas a a tener una aplicación fullstack IoT del mundo real que utiliza tecnologías actuales en la que un backend es capaz de interactuar con una DB para cumplir con las peticiones de control que se le mandan desde el cliente web.

En esta imagen podés ver una posible implementación del cliente web que controla los artefactos del hogar.

![architecture](doc/webapp-example-1.png)

## Comenzando 🚀

Esta sección es una guía con los pasos escenciales para que puedas poner en marcha la aplicación.

<details><summary><b>Mira los pasos necesarios</b></summary><br>

### Instalar las dependencias

Para correr este proyecto es necesario que instales `Docker` y `Docker Compose`. 

En [este artículo](https://www.gotoiot.com/pages/articles/docker_installation_linux/) publicado en nuestra web están los detalles para instalar Docker y Docker Compose en una máquina Linux. Si querés instalar ambas herramientas en una Raspberry Pi podés seguir [este artículo](https://www.gotoiot.com/pages/articles/rpi_docker_installation) de nuestra web que te muestra todos los pasos necesarios.

En caso que quieras instalar las herramientas en otra plataforma o tengas algún incoveniente, podes leer la documentación oficial de [Docker](https://docs.docker.com/get-docker/) y también la de [Docker Compose](https://docs.docker.com/compose/install/).

Continua con la descarga del código cuando tengas las dependencias instaladas y funcionando.

### Descargar el código

Para descargar el código, lo más conveniente es que realices un `fork` de este proyecto a tu cuenta personal haciendo click en [este link](https://github.com/gotoiot/app-fullstack-base/fork). Una vez que ya tengas el fork a tu cuenta, descargalo con este comando (acordate de poner tu usuario en el link):

```
git clone https://github.com/USER/app-fullstack-base.git
```

> En caso que no tengas una cuenta en Github podes clonar directamente este repo.

### Ejecutar la aplicación

Para ejecutar la aplicación tenes que correr el comando `docker-compose up` desde la raíz del proyecto. Este comando va a descargar las imágenes de Docker de node, de typescript, de la base datos y del admin de la DB, y luego ponerlas en funcionamiento. 

Para acceder al cliente web ingresa a a la URL [http://localhost:8000/](http://localhost:8000/) y para acceder al admin de la DB accedé a [localhost:8001/](http://localhost:8001/). 

Si pudiste acceder al cliente web y al administrador significa que la aplicación se encuentra corriendo bien. 

> Si te aparece un error la primera vez que corres la app, deteńe el proceso y volvé a iniciarla. Esto es debido a que el backend espera que la DB esté creada al iniciar, y en la primera ejecución puede no alcanzar a crearse. A partir de la segunda vez el problema queda solucionado.

</details>

Continuá explorando el proyecto una vez que lo tengas funcionando.

## Configuraciones de funcionamiento 🔩

Al crearse la aplicación se ejecutan los contenedores de Docker de cada servicio, se crea la base de datos y sus tablas. A continuación podés encontrar info si querés cambiar la estructura de la DB o bien sus configuraciones de acceso.

<details><summary><b>Lee cómo configurar la aplicación</b></summary><br>

### Configuración de la DB

Como ya comprobaste, para acceder PHPMyAdmin tenés que ingresar en la URL [localhost:8001/](http://localhost:8001/). En el login del administrador, el usuario para acceder a la db es `root` y contraseña es la variable `MYSQL_ROOT_PASSWORD` del archivo `docker-compose.yml`.

Para el caso del servicio de NodeJS que se comunica con la DB fijate que en el archivo `src/backend/mysql-connector.js` están los datos de acceso para ingresar a la base.

Si quisieras cambiar la contraseña, puertos, hostname u otras configuraciones de la DB deberías primero modificar el servicio de la DB en el archivo `docker-compose.yml` y luego actualizar las configuraciones para acceder desde PHPMyAdmin y el servicio de NodeJS.

### Estructura de la DB

Al iniciar el servicio de la base de datos, si esta no está creada toma el archivo que se encuentra en `db/dumps/smart_home.sql` para crear la base de datos automáticamente.

En ese archivo está la configuración de la tabla `Devices` y otras configuraciones más. Si quisieras cambiar algunas configuraciones deberías modificar este archivo y crear nuevamente la base de datos para que se tomen en cuenta los cambios.

Tené en cuenta que la base de datos se crea con permisos de superusuario por lo que no podrías borrar el directorio con tu usuario de sistema, para eso debés hacerlo con permisos de administrador. En ese caso podés ejecutar el comando `sudo rm -r db/data` para borrar el directorio completo.

</details>


## Detalles principales 🔍

En esta sección vas a encontrar las características más relevantes del proyecto.

<details><summary><b>Mira los detalles más importantes de la aplicación</b></summary><br>
<br>

### Arquitectura de la aplicación

Como ya pudiste ver, la aplicación se ejecuta sobre el ecosistema Docker, y en esta imagen podés ver el diagrama de arquitectura.

![architecture](doc/architecture.png)

### El cliente web

El cliente web es una Single Page Application que se comunica con el servicio en NodeJS mediante JSON a través de requests HTTP. Puede consultar el estado de dispositivos en la base de datos (por medio del servicio en NodeJS) y también cambiar el estado de los mismos. Los estilos del código están basados en **Material Design**.

### El servicio web

El servicio en **NodeJS** posee distintos endpoints para comunicarse con el cliente web mediante requests HTTP enviando **JSON** en cada transacción. Procesando estos requests es capaz de comunicarse con la base de datos para consultar y controlar el estado de los dispositivos, y devolverle una respuesta al cliente web también en formato JSON. Así mismo el servicio es capaz de servir el código del cliente web.

### La base de datos

La base de datos se comunica con el servicio de NodeJS y permite almacenar el estado de los dispositivos en la tabla **Devices**. Ejecuta un motor **MySQL versión 5.7** y permite que la comunicación con sus clientes pueda realizarse usando usuario y contraseña en texto plano. En versiones posteriores es necesario brindar claves de acceso, por este motivo la versión 5.7 es bastante utilizada para fases de desarrollo.

### El administrador de la DB

Para esta aplicación se usa **PHPMyAdmin**, que es un administrador de base de datos web muy utilizado y que podés utilizar en caso que quieras realizar operaciones con la base, como crear tablas, modificar columnas, hacer consultas y otras cosas más.

### El compilador de TypeScript

**TypeScript** es un lenguaje de programación libre y de código abierto desarrollado y mantenido por Microsoft. Es un superconjunto de JavaScript, que esencialmente añade tipos estáticos y objetos basados en clases. Para esta aplicación se usa un compilador de TypeScript basado en una imagen de [Harmish](https://hub.docker.com/r/harmish) en Dockerhub, y está configurado para monitorear en tiempo real los cambios que se realizan sobre el directorio **src/frontend/ts** y automáticamente generar código compilado a JavaScript en el directorio  **src/frontend/js**. Los mensajes del compilador aparecen automáticamente en la terminal al ejecutar el comando **docker-compose up**.

### Ejecución de servicios

Los servicios de la aplicación se ejecutan sobre **contenedores de Docker**, así se pueden desplegar de igual manera en diferentes plataformas. Los detalles sobre cómo funcionan los servicios los podés ver directamente en el archivo **docker-compose.yml**.

### Organización del proyecto

En la siguiente ilustración podés ver cómo está organizado el proyecto para que tengas en claro qué cosas hay en cada lugar.

```sh
├── db                          # directorio de la DB
│   ├── data                    # estructura y datos de la DB
│   └── dumps                   # directorio de estructuras de la DB
│       └── smart_home.sql      # estructura con la base de datos "smart_home"
├── doc                         # documentacion general del proyecto
└── src                         # directorio codigo fuente
│   ├── backend                 # directorio para el backend de la aplicacion
│   │   ├── index.js            # codigo principal del backend
│   │   ├── mysql-connector.js  # codigo de conexion a la base de datos
│   │   ├── package.json        # configuracion de proyecto NodeJS
│   │   └── package-lock.json   # configuracion de proyecto NodeJS
│   └── frontend                # directorio para el frontend de la aplicacion
│       ├── js                  # codigo javascript que se compila automáticamente
│       ├── static              # donde alojan archivos de estilos, imagenes, fuentes, etc.
│       ├── ts                  # donde se encuentra el codigo TypeScript a desarrollar
│       └── index.html          # archivo principal del cliente HTML
├── docker-compose.yml          # archivo donde se aloja la configuracion completa
├── README.md                   # este archivo
├── CHANGELOG.md                # archivo para guardar los cambios del proyecto
├── LICENSE.md                  # licencia del proyecto
```

> No olvides ir poniendo tus cambios en el archivo `CHANGELOG.md` a medida que avanzas en el proyecto.

</details>

## Detalles de implementación 💻

En esta sección podés ver los detalles específicos de funcionamiento del código y que son los siguientes.

<details><summary><b>Mira los detalles de implementación</b></summary><br>
    
### Tipos de dispositivos

La aplicación soporta 7 tipos de dispositivos:
    
    0- Luces
    
    1- Ventanas/persianas
    
    2- Ventiladores
    
    3- TV's
    
    4- Dispositivos de audio
    
    5- Aires acondicionados
    
    6- Toma corriente

Los dispositivos del tipo 1, 2 y 5 poseen un slider para encenderlos y establecer su valor de estado exacto, mientras que el resto de los dispositivos poseen un switch para encenderlos o apagarlos.  
    
### Agregar un dispositivo
    
Para agregar un dispositivo desde el cliente web se debe acceder a la aplicación mediante la URL: http://localhost:8000/.

Una vez allí, se podrá observar el listado de dispositivos creados. Imagen de referencia:
    
![image](https://user-images.githubusercontent.com/46693419/206023132-1929bed9-5f91-4d76-863a-0cea4d32cf28.png)
    
Desde esta pantalla, se debe hacer click en el botón que tiene la leyenda "Add new device". Esta acción abrirá un modal con los datos a completar para la creación de un nuevo dispositivo. Imagen de referencia:
    
![image](https://user-images.githubusercontent.com/46693419/206023424-2f78c74e-10cd-4a63-9bd4-e521d4a2fa16.png)

Una vez completados los datos, se debe hacer click en el botón que tiene la leyenda "Create". Imágenes de referencia:
    
![image](https://user-images.githubusercontent.com/46693419/206023894-5a8ac7ab-da28-4d4b-a6d6-057f77f1fd44.png)
    
![image](https://user-images.githubusercontent.com/46693419/206024042-8cf05b09-7b8e-4000-abaa-1b67c1c3708c.png)
    
Se debe recalcar que todos los datos del formulario son obligatorios, en caso de no completarlos se indicará un mensaje de error por medio de un toast. Imagen de referencia: 
    
![image](https://user-images.githubusercontent.com/46693419/206023963-2580c81f-7570-40df-b528-421186bb5a99.png)
    
### Frontend

El frontend fue desarrollado con TypeScript.

La aplicación posee 4 funcionalidades básicas:
    
    1- Crear un nuevo dispositivo: Esta funcionalidad se realiza mediante el modal que se abre al hacer click en el botón con la leyenda "Add new device".
    
    2- Editar un dispositivo específico: Esta funcionalidad se realiza mediante el modal que se abre al hacer click en el boton con la leyenda "Update" de alguno de los dispositivos creados. Otra forma de editar un dispositivo es mediante el toggle de su switch o el deslizamiento de su slider dependiendo de que tipo de dispositivo sea.
    
    3- Eliminar un dispositivo específico: Esta funcionalidad se realiza al hacer click en el botón con la leyenda "Delete" de alguno de los dispositivos creados.
    
    4- Listar todos los dispositivos creados: Esta funcionalidad se realiza cuando el usuario ingresa a la aplicación. Cada dispositivo posee su card que contiene sus datos (incluyendo un icono que indica el tipo de dispositivo), a su vez también contiene un boton de eliminar y otro de modificar.

Las validaciones de los datos de los dispositivos para la funcionalidad 1 y 2 se realiza tanto en el frontend como en el backend.    
    
Se debe recalcar que al ejecutar cada una de estas funcionalidades internamente el frontend estará realizando llamadas HTTP al backend para poder obtener el resultado esperado.
   
A su vez al ejecutar las funcionalidades 1, 2 o 3 se emitirá un toast para informar al usuario si la operación tuvo éxito o fallo. Mientras que para la funcionalidad 4 se emitirá un toast si la operación falla.
    
### Backend

Las tecnologías utilizadas para el desarrollo del backend son NodeJS utilizando ExpressJS y MySQL.
    
La API se crea en el archivo "index.js", el cual se encuentra en la raíz de la carpeta "backend".
Los endpoints de los dispositivos están definidos en un archivo separado, el cual está en la ruta "routes/devices.routes.js". Este archivo es importado en el "index.js" para crear los endpoints correspondientes.
    
Por otra parte, se creó un archivo en la ruta "misc/utils.js" para colocar las validaciones a los datos de los dispositivos para los endpoints POST y PUT. 
 
<details><summary><b>Ver los endpoints disponibles</b></summary><br>

1) Endpoint para obtener todos los dispositivos.
    
    URL: http://localhost:8000/api/devices
    
    ```json
    {
        "method": "get",
        "request_headers": "application/json",
        "response_code": 200,
        "request_response": [
                {"id":6,"name":"Persiana 3","description":"Persiana balcon","state":73,"type":1},
                {"id":25,"name":"bc","description":"b","state":1,"type":0},                           
                {"id":26,"name":"w","description":"w","state":0,"type":0}
         ]
    }
    ```
    
    El status code de respuesta en caso de éxito será 200. En caso de que la operación falle el status code de respuesta será 500. 
    
2) Endpoint para obtener un dispositivo específico a partir de su id.
    
    URL: http://localhost:8000/api/devices/:id
    
    Ejemplo: http://localhost:8000/api/devices/6
    
    ```json
    {
        "method": "get",
        "request_headers": "application/json",
        "response_code": 200,
        "request_response": { "id":6,"name":"Persiana 3","description":"Persiana balcon","state":73,"type":1 },
    }
    ```
    
    El status code de respuesta en caso de éxito será 200. En caso de que la operación falle debido a que el dispositivo no existe, el status code de respuesta será       404. En caso de fallar por algun otro motivo, su status code de respuesta será 500.
    
3) Endpoint para crear un nuevo dispositivo.
    
    URL: http://localhost:8000/api/devices
    
    ```json
    {
        "method": "post",
        "request_headers": "application/json",
        "response_code": 200,
        "payload": { name: "Example", description: "Example", type: 0 },
        "request_response": {"id":28,"name":"Example","description":"Example","state":0,"type":0},
    }
    ```
    
    El status code de respuesta en caso de éxito será 200. En caso de que la operación falle debido a que el dispositivo no existe, el status code de respuesta será       404. Si la validación de los datos del dispositivo falla, el status code de respuesta sera 400. En caso de fallar por algun otro motivo, su status code de             respuesta será 500.  
    
4) Endpoint para modificar un dispositivo específico a partir de su id.
    
    URL: http://localhost:8000/api/devices/:id
    
    Ejemplo: http://localhost:8000/api/devices/28
    
    ```json
    {
        "method": "put",
        "request_headers": "application/json",
        "response_code": 200,
        "payload": { id: 28, name: "Example Two", description: "Example Two", type: 0, state: 0 },
        "request_response": {"id":28,"name":"Example Two","description":"Example Two","state":0,"type":0},
    }
    ```
    
    El status code de respuesta en caso de éxito será 200. En caso de que la operación falle debido a que el dispositivo no existe, el status code de respuesta será       404. Si la validación de los datos del dispositivo falla, el status code de respuesta sera 400. En caso de fallar por algun otro motivo, su status code de             respuesta será 500. 
    
5) Endpoint para eliminar un dispositivo específico a partir de su id.
    
    URL: http://localhost:8000/api/devices/:id
    
    Ejemplo: http://localhost:8000/api/devices/27
    
    ```json
    {
        "method": "delete",
        "request_headers": "application/json",
        "response_code": 200,
        "request_response": "27",
    }
    ```
    
    El status code de respuesta en caso de éxito será 200. En caso de que la operación falle debido a que el dispositivo no existe, el status code de respuesta será       404. En caso de fallar por algun otro motivo, su status code de respuesta será 500.  
    
</details>

</details>


## Tecnologías utilizadas 🛠️

En esta sección podés ver las tecnologías más importantes utilizadas.

<details><summary><b>Mira la lista completa de tecnologías</b></summary><br>

* [Docker](https://www.docker.com/) - Ecosistema que permite la ejecución de contenedores de software.
* [Docker Compose](https://docs.docker.com/compose/) - Herramienta que permite administrar múltiples contenedores de Docker.
* [Node JS](https://nodejs.org/es/) - Motor de ejecución de código JavaScript en backend.
* [MySQL](https://www.mysql.com/) - Base de datos para consultar y almacenar datos.
* [PHPMyAdmin](https://www.phpmyadmin.net/) - Administrador web de base de datos.
* [Material Design](https://material.io/design) - Bibliotecas de estilo responsive para aplicaciones web.
* [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript tipado y con clases.

</details>

## Contribuir 🖇️

Si estás interesado en el proyecto y te gustaría sumar fuerzas para que siga creciendo y mejorando, podés abrir un hilo de discusión para charlar tus propuestas en [este link](https://github.com/gotoiot/app-fullstack-base/issues/new). Así mismo podés leer el archivo [Contribuir.md](https://github.com/gotoiot/gotoiot-doc/wiki/Contribuir) de nuestra Wiki donde están bien explicados los pasos para que puedas enviarnos pull requests.

## Sobre Goto IoT 📖

Goto IoT es una plataforma que publica material y proyectos de código abierto bien documentados junto a una comunidad libre que colabora y promueve el conocimiento sobre IoT entre sus miembros. Acá podés ver los links más importantes:

* **[Sitio web](https://www.gotoiot.com/):** Donde se publican los artículos y proyectos sobre IoT. 
* **[Github de Goto IoT:](https://github.com/gotoiot)** Donde están alojados los proyectos para descargar y utilizar. 
* **[Comunidad de Goto IoT:](https://groups.google.com/g/gotoiot)** Donde los miembros de la comunidad intercambian información e ideas, realizan consultas, solucionan problemas y comparten novedades.
* **[Twitter de Goto IoT:](https://twitter.com/gotoiot)** Donde se publican las novedades del sitio y temas relacionados con IoT.
* **[Wiki de Goto IoT:](https://github.com/gotoiot/doc/wiki)** Donde hay información de desarrollo complementaria para ampliar el contexto.

## Muestras de agradecimiento 🎁

Si te gustó este proyecto y quisieras apoyarlo, cualquiera de estas acciones estaría más que bien para nosotros:

* Apoyar este proyecto con una ⭐ en Github para llegar a más personas.
* Sumarte a [nuestra comunidad](https://groups.google.com/g/gotoiot) abierta y dejar un feedback sobre qué te pareció el proyecto.
* [Seguirnos en twitter](https://github.com/gotoiot/doc/wiki) y dejar algún comentario o like.
* Compartir este proyecto con otras personas.

## Autores 👥

Las colaboraciones principales fueron realizadas por:

* **[Agustin Bassi](https://github.com/agustinBassi)**: Ideación, puesta en marcha y mantenimiento del proyecto.
* **[Ernesto Giggliotti](https://github.com/ernesto-g)**: Creación inicial del frontend, elección de Material Design.
* **[Brian Ducca](https://github.com/brianducca)**: Ayuda para conectar el backend a la base de datos, puesta a punto de imagen de Docker.

También podés mirar todas las personas que han participado en la [lista completa de contribuyentes](https://github.com/###/contributors).

## Licencia 📄

Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.

---

**Copyright © Goto IoT 2021** ⌨️ [**Website**](https://www.gotoiot.com) ⌨️ [**Group**](https://groups.google.com/g/gotoiot) ⌨️ [**Github**](https://www.github.com/gotoiot) ⌨️ [**Twitter**](https://www.twitter.com/gotoiot) ⌨️ [**Wiki**](https://github.com/gotoiot/doc/wiki)
