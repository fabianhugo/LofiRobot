/**
 * LOFI ROBOT Bluetooth - Multilingual Extension
 */
//% weight=20 color=#ff6900 icon="\uf278"

enum RobotAppType {
    //% block="Face-App"
    FaceApp,
    //% block="Control"
    Control
}

enum FaceValues {
    //% block="X"
    X,
    //% block="Y"
    Y,
    //% block="Z"
    Z,
    //% block="robot.face.yaw"
    Yaw,
    //% block="robot.face.pitch"
    Pitch,
    //% block="robot.face.mouth"
    Mouth,
    //% block="robot.face.leftEye"
    LeftEye,
    //% block="robot.face.rightEye"
    RightEye,
    //% block="robot.face.roll"
    Roll,
    //% block="robot.face.smile"
    Smile,
    //% block="robot.face.visible"
    FaceVisible
}

enum ControlValues {
    //% block="robot.control.joystickX"
    XValue,
    //% block="robot.control.steering"
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
    //% block="robot.initialize %appType"
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
    //% block="robot.onBluetoothConnected"
    //% weight=90
    export function onBluetoothConnected(handler: () => void): void {
        bluetooth.onBluetoothConnected(handler)
    }

    /**
     * Executed when a Bluetooth connection is disconnected
     * @param handler Code to be executed
     */
    //% block="robot.onBluetoothDisconnected"
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
    //% block="robot.onDataReceived"
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
    //% block="robot.showFaceBarGraph %valueType"
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
    //% block="robot.getFaceValue %value"
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
    //% block="robot.getControlValue %value"
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