/**
 * LOFI ROBOT Bluetooth Extension
 */
//% weight=20 color=#ff6900 icon="\uf118"

enum RobotAppType {
    //% block="Face-App"
    //% block.loc.de="Face-App"
    //% block.loc.fr="Face-App"
    //% block.loc.es="Face-App"
    //% block.loc.it="Face-App"
    //% block.loc.el="Face-App"
    FaceApp,
    //% block="Control"
    //% block.loc.de="Control"
    //% block.loc.fr="Control"
    //% block.loc.es="Control"
    //% block.loc.it="Control"
    //% block.loc.el="Control"
    Control
}

enum FaceValues {
    //% block="X"
    //% block.loc.de="X"
    //% block.loc.fr="X"
    //% block.loc.es="X"
    //% block.loc.it="X"
    //% block.loc.el="X"
    X,
    //% block="Y"
    //% block.loc.de="Y"
    //% block.loc.fr="Y"
    //% block.loc.es="Y"
    //% block.loc.it="Y"
    //% block.loc.el="Y"
    Y,
    //% block="Z"
    //% block.loc.de="Z"
    //% block.loc.fr="Z"
    //% block.loc.es="Z"
    //% block.loc.it="Z"
    //% block.loc.el="Z"
    Z,
    //% block="Yaw"
    //% block.loc.de="Gieren"
    //% block.loc.fr="Lacet"
    //% block.loc.es="Guiñada"
    //% block.loc.it="Imbardata"
    //% block.loc.el="Εκτροπή"
    Yaw,
    //% block="Pitch"
    //% block.loc.de="Nicken"
    //% block.loc.fr="Tangage"
    //% block.loc.es="Cabeceo"
    //% block.loc.it="Beccheggio"
    //% block.loc.el="Κλίση"
    Pitch,
    //% block="Mouth"
    //% block.loc.de="Mund"
    //% block.loc.fr="Bouche"
    //% block.loc.es="Boca"
    //% block.loc.it="Bocca"
    //% block.loc.el="Στόμα"
    Mouth,
    //% block="Left Eye"
    //% block.loc.de="Linkes Auge"
    //% block.loc.fr="Œil gauche"
    //% block.loc.es="Ojo izquierdo"
    //% block.loc.it="Occhio sinistro"
    //% block.loc.el="Αριστερό μάτι"
    LeftEye,
    //% block="Right Eye"
    //% block.loc.de="Rechtes Auge"
    //% block.loc.fr="Œil droit"
    //% block.loc.es="Ojo derecho"
    //% block.loc.it="Occhio destro"
    //% block.loc.el="Δεξί μάτι"
    RightEye,
    //% block="Roll"
    //% block.loc.de="Rollen"
    //% block.loc.fr="Roulis"
    //% block.loc.es="Balanceo"
    //% block.loc.it="Rollio"
    //% block.loc.el="Κύλιση"
    Roll,
    //% block="Smile"
    //% block.loc.de="Lächeln"
    //% block.loc.fr="Sourire"
    //% block.loc.es="Sonrisa"
    //% block.loc.it="Sorriso"
    //% block.loc.el="Χαμόγελο"
    Smile,
    //% block="Face Visible"
    //% block.loc.de="Gesicht sichtbar"
    //% block.loc.fr="Visage visible"
    //% block.loc.es="Cara visible"
    //% block.loc.it="Viso visibile"
    //% block.loc.el="Πρόσωπο ορατό"
    FaceVisible
}

enum ControlValues {
    //% block="Joystick X"
    //% block.loc.de="Joystick X"
    //% block.loc.fr="Joystick X"
    //% block.loc.es="Joystick X"
    //% block.loc.it="Joystick X"
    //% block.loc.el="Joystick X"
    XValue,
    //% block="Slider"
    //% block.loc.de="Slider"
    //% block.loc.fr="Slider"
    //% block.loc.es="Slider"
    //% block.loc.it="Slider"
    //% block.loc.el="Slider"
    Control
}

namespace LofiRobot {
    // Face-App Variables
    let face_x = 0
    let face_y = 0
    let face_z = 0
    let face_yaw = 0
    let face_pitch = 0
    let face_mouth = 0
    let face_left_eye = 0
    let face_right_eye = 0
    let face_roll = 0
    let face_smile = 0
    let face_visible = 0
    let face_app_enabled = false

    // Control Variables
    let control_x_value = 0
    let control_command = ""
    let control_value = 0
    let control_app_enabled = false

    let receivedString = ""
    let bluetoothStarted = false
    let data_received_handler: () => void = null
    let current_app_type: RobotAppType = null

    /**
     * Initialize Bluetooth control for the selected app
     * @param appType Choose the app (Face-App or Control)
     */
    //% block="Initialize %appType"
    //% block.loc.de="Initialisiere %appType"
    //% block.loc.fr="Initialiser %appType"
    //% block.loc.es="Inicializar %appType"
    //% block.loc.it="Inizializza %appType"
    //% block.loc.el="Αρχικοποίηση %appType"
    //% weight=100
    export function initializeApp(appType: RobotAppType): void {
        if (!bluetoothStarted) {
            bluetooth.startUartService()
            basic.showIcon(IconNames.Square)
            bluetoothStarted = true
        }

        if (appType === RobotAppType.FaceApp) {
            face_app_enabled = true
            // Blink center LED 3 times
            for (let i = 0; i < 3; i++) {
                led.plot(2, 2)
                basic.pause(200)
                led.unplot(2, 2)
                basic.pause(200)
            }
        } else if (appType === RobotAppType.Control) {
            control_app_enabled = true
            // Blink center LED 3 times
            for (let i = 0; i < 3; i++) {
                led.plot(2, 2)
                basic.pause(200)
                led.unplot(2, 2)
                basic.pause(200)
            }
        }

        // Setup Bluetooth receive function if not already done
        setupBluetoothReceive()
    }

    /**
     * Executed when Bluetooth data is received
     * @param handler Code to be executed
     */
    //% block="on Bluetooth connected"
    //% block.loc.de="wenn Bluetooth empfang"
    //% block.loc.fr="quand Bluetooth connecté"
    //% block.loc.es="cuando Bluetooth conectado"
    //% block.loc.it="quando Bluetooth connesso"
    //% block.loc.el="όταν συνδέεται Bluetooth"
    //% weight=90
    export function onBluetoothConnected(handler: () => void): void {
        bluetooth.onBluetoothConnected(handler)
    }

    /**
     * Executed when a Bluetooth connection is disconnected
     * @param handler Code to be executed
     */
    //% block="on Bluetooth disconnected"
    //% block.loc.de="wenn Bluetooth getrennt"
    //% block.loc.fr="quand Bluetooth déconnecté"
    //% block.loc.es="cuando Bluetooth desconectado"
    //% block.loc.it="quando Bluetooth disconnesso"
    //% block.loc.el="όταν αποσυνδέεται Bluetooth"
    //% weight=80
    export function onBluetoothDisconnected(handler: () => void): void {
        bluetooth.onBluetoothDisconnected(handler)
    }

    // Private function to setup Bluetooth receiving
    function setupBluetoothReceive(): void {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

            // For Face-App: Check if string has correct length and contains numbers
            if (face_app_enabled && receivedString.length >= 19) {
                let hasNumbers = parseInt(receivedString) >= 0
                if (hasNumbers) {
                    processFaceAppData()
                    current_app_type = RobotAppType.FaceApp
                }
            }

            // For Control: Check if string contains commands
            if (control_app_enabled) {
                if (receivedString === "up" ||
                    receivedString === "down" ||
                    receivedString === "left" ||
                    receivedString === "right" ||
                    receivedString === "horn" ||
                    receivedString === "stop" ||
                    receivedString.charAt(0) === "x" ||
                    receivedString.charAt(0) === "c") {

                    processControlData()
                    current_app_type = RobotAppType.Control
                }
            }

            if (data_received_handler) {
                data_received_handler()
            }
        })
    }

    /**
     * Processes Face-App data from received string
     */
    function processFaceAppData(): void {
        face_x = parseFloat(receivedString.substr(0, 2))
        face_y = parseFloat(receivedString.substr(2, 2))
        face_z = parseFloat(receivedString.substr(4, 2))
        face_yaw = parseFloat(receivedString.substr(6, 2))
        face_pitch = parseFloat(receivedString.substr(8, 2))
        face_mouth = parseFloat(receivedString.substr(10, 2))
        face_left_eye = parseFloat(receivedString.substr(12, 2))
        face_right_eye = parseFloat(receivedString.substr(14, 2))
        face_roll = parseFloat(receivedString.substr(16, 1))
        face_smile = parseFloat(receivedString.substr(17, 1))
        face_visible = parseFloat(receivedString.substr(18, 1))
    }

    /**
     * Processes Control data from received string
     */
    function processControlData(): void {
        control_command = receivedString
        if (receivedString === "up") {
            basic.showIcon(IconNames.ArrowNorth)
            control_value = 100
        } else if (receivedString === "down") {
            basic.showIcon(IconNames.ArrowSouth)
            control_value = 50
        } else if (receivedString === "left") {
            basic.showIcon(IconNames.ArrowWest)
            control_value = 25
        } else if (receivedString === "right") {
            basic.showIcon(IconNames.ArrowEast)
            control_value = 75
        } else if (receivedString === "horn") {
            basic.showIcon(IconNames.EighthNote)
            control_value = 90
        } else if (receivedString === "stop") {
            basic.showIcon(IconNames.SmallSquare)
            control_value = 0
        } else if (receivedString.charAt(0) === "x" || receivedString.charAt(0) === "c") {
            control_x_value = parseFloat(receivedString.substr(1, 3))
        }
    }

    /**
     * Executed when data is received
     * @param handler Code to be executed
     */
    //% block="Robot connection"
    //% block.loc.de="Roboterverbindung"
    //% block.loc.fr="Connexion robot"
    //% block.loc.es="Conexión robot"
    //% block.loc.it="Connessione robot"
    //% block.loc.el="Σύνδεση ρομφότ"
    //% weight=70
    export function onDataReceived(handler: () => void): void {
        data_received_handler = handler
    }

    /**
     * Returns the current Control command
     */
    export function getControlCommand(): string {
        return control_command
    }

    /**
     * Shows a bar graph with the selected Face-App value
     * @param valueType Choose the Face-App value to display
     */
    //% block="show bar graph for Face-App value %valueType"
    //% block.loc.de="zeige Säulendiagramm für Face-App Wert %valueType"
    //% block.loc.fr="afficher graphique en barres pour valeur Face-App %valueType"
    //% block.loc.es="mostrar gráfico de barras para valor Face-App %valueType"
    //% block.loc.it="mostra grafico a barre per valore Face-App %valueType"
    //% block.loc.el="εμφάνιση γραφήματος στηλών για αξία Face-App %valueType"
    //% weight=55
    export function showFaceBarGraph(valueType: FaceValues): void {
        let valueToShow = 0
        let maxValue = 100

        switch (valueType) {
            case FaceValues.X:
                valueToShow = face_x
                break
            case FaceValues.Y:
                valueToShow = face_y
                break
            case FaceValues.Z:
                valueToShow = face_z
                break
            case FaceValues.Yaw:
                valueToShow = face_yaw
                break
            case FaceValues.Pitch:
                valueToShow = face_pitch
                break
            case FaceValues.Mouth:
                valueToShow = face_mouth
                break
            case FaceValues.LeftEye:
                valueToShow = face_left_eye
                break
            case FaceValues.RightEye:
                valueToShow = face_right_eye
                break
            case FaceValues.Roll:
                valueToShow = face_roll
                break
            case FaceValues.Smile:
                valueToShow = face_smile
                break
            case FaceValues.FaceVisible:
                valueToShow = face_visible
                break
        }

        led.plotBarGraph(valueToShow, maxValue)
    }

    /**
     * Returns the selected Face-App value
     * @param value Choose the value to return
     */
    //% block="Face-App value %value"
    //% block.loc.de="Face-App Wert %value"
    //% block.loc.fr="valeur Face-App %value"
    //% block.loc.es="valor Face-App %value"
    //% block.loc.it="valore Face-App %value"
    //% block.loc.el="αξία Face-App %value"
    //% weight=50
    export function getFaceValue(value: FaceValues): number {
        switch (value) {
            case FaceValues.X:
                return face_x
            case FaceValues.Y:
                return face_y
            case FaceValues.Z:
                return face_z
            case FaceValues.Yaw:
                return face_yaw
            case FaceValues.Pitch:
                return face_pitch
            case FaceValues.Mouth:
                return face_mouth
            case FaceValues.LeftEye:
                return face_left_eye
            case FaceValues.RightEye:
                return face_right_eye
            case FaceValues.Roll:
                return face_roll
            case FaceValues.Smile:
                return face_smile
            case FaceValues.FaceVisible:
                return face_visible
            default:
                return 0
        }
    }

    /**
     * Returns the selected Control value
     * @param value Choose the value to return
     */
    //% block="Control value %value"
    //% block.loc.de="Control Wert %value"
    //% block.loc.fr="valeur Control %value"
    //% block.loc.es="valor Control %value"
    //% block.loc.it="valore Control %value"
    //% block.loc.el="αξία Control %value"
    //% weight=45
    export function getControlValue(value: ControlValues): number {
        switch (value) {
            case ControlValues.XValue:
                return control_x_value
            case ControlValues.Control:
                return control_value
            default:
                return 0
        }
    }
}
