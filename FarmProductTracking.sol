// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmProductTracking {

    // 👨‍🌾 Farmer Info
    struct Farmer {
        string name;
        string location;
        string contact;
        string email;
        string aadhaar;
        string profilePhotoHash;
        string certificationStatus;
        string farmSize;
        string pincode;
    }

    // 🏭 Processing
    struct ProcessingDetail {
        string processType;
        string facilityName;
        string location;
        string certification;
        string additionalNotes;
        uint256 timestamp;
    }

    // 🚚 Transportation
    struct TransportationDetail {
        string mode;
        string carrierName;
        string licensePlate;
        string routeInfo;
        string additionalNotes;
        uint256 timestamp;
    }

    // 🔁 Custody Transfer
    struct CustodyRecord {
        address from;
        address to;
        string reason;
        string location;
        string notes;
        uint256 timestamp;
    }

    // 📦 Batch Info
    struct ProductBatch {
        uint256 batchId;
        address farmerAddress;
        string productName;
        string variety;
        uint256 quantity;
        uint256 harvestDate;
        string organicStatus;
        string additionalNotes;
        ProcessingDetail[] processingDetails;
        TransportationDetail[] transportationDetails;
        CustodyRecord[] custodyHistory;
        BatchStatus status;
    }

    enum BatchStatus { Created, Processing, InTransit, Received }

    mapping(address => Farmer) public farmers;
    mapping(uint256 => ProductBatch) public batches;
    uint256 public nextBatchId = 1;

    event FarmerRegistered(address indexed farmerAddress, string name, string location);
    event BatchCreated(uint256 indexed batchId, address indexed farmerAddress, string productName, uint256 quantity);
    event ProductProcessed(uint256 indexed batchId, string processType, address indexed processedBy);
    event ProductShipped(uint256 indexed batchId, string mode, address indexed shippedBy);
    event CustodyTransferred(uint256 indexed batchId, address indexed from, address indexed to);
    event BatchStatusUpdatedEvent(uint256 indexed batchId, uint8 status);
    event BatchReceived(uint256 indexed batchId, string receiverName, address indexed receiver);

    // 🧱 Modifiers
    modifier onlyFarmer() {
        require(bytes(farmers[msg.sender].name).length > 0, "Only registered farmers can perform this action.");
        _;
    }

    modifier validBatchId(uint256 _batchId) {
        require(batches[_batchId].batchId == _batchId, "Invalid batch ID.");
        _;
    }

    modifier isCurrentCustodian(uint256 _batchId) {
        require(
            batches[_batchId].custodyHistory.length > 0 &&
            batches[_batchId].custodyHistory[batches[_batchId].custodyHistory.length - 1].to == msg.sender,
            "Only the current custodian can perform this action."
        );
        _;
    }

    modifier isOriginatingFarmer(uint256 _batchId) {
        require(batches[_batchId].farmerAddress == msg.sender, "Only the originating farmer can perform this action.");
        _;
    }

    // 🧾 Register Farmer (ONE-TIME RESTRICTION)
    function registerFarmer(
        string memory _name,
        string memory _location,
        string memory _contact,
        string memory _email,
        string memory _aadhaar,
        string memory _profilePhotoHash,
        string memory _certificationStatus,
        string memory _farmSize,
        string memory _pincode
    ) public {
        require(bytes(farmers[msg.sender].name).length == 0, "Farmer already registered.");
        farmers[msg.sender] = Farmer(
            _name,
            _location,
            _contact,
            _email,
            _aadhaar,
            _profilePhotoHash,
            _certificationStatus,
            _farmSize,
            _pincode
        );
        emit FarmerRegistered(msg.sender, _name, _location);
    }

    // 📦 Create Batch
    function createBatch(
        string memory _productName,
        string memory _variety,
        uint256 _quantity,
        uint256 _harvestDate,
        string memory _organicStatus,
        string memory _additionalNotes
    ) public onlyFarmer {
        ProductBatch storage newBatch = batches[nextBatchId];
        newBatch.batchId = nextBatchId;
        newBatch.farmerAddress = msg.sender;
        newBatch.productName = _productName;
        newBatch.variety = _variety;
        newBatch.quantity = _quantity;
        newBatch.harvestDate = _harvestDate;
        newBatch.organicStatus = _organicStatus;
        newBatch.additionalNotes = _additionalNotes;
        newBatch.status = BatchStatus.Created;

        newBatch.custodyHistory.push(CustodyRecord({
            from: address(0),
            to: msg.sender,
            reason: "Initial Ownership",
            location: farmers[msg.sender].location,
            notes: "Batch created by farmer",
            timestamp: block.timestamp
        }));

        emit BatchCreated(nextBatchId, msg.sender, _productName, _quantity);
        nextBatchId++;
    }

    // 🏭 Add Processing Details
    function addProcessingDetails(
        uint256 _batchId,
        string memory _processType,
        string memory _facilityName,
        string memory _location,
        string memory _certification,
        string memory _additionalNotes
    ) public onlyFarmer validBatchId(_batchId) isOriginatingFarmer(_batchId) {
        ProductBatch storage batch = batches[_batchId];
        batch.processingDetails.push(ProcessingDetail({
            processType: _processType,
            facilityName: _facilityName,
            location: _location,
            certification: _certification,
            additionalNotes: _additionalNotes,
            timestamp: block.timestamp
        }));
        batch.status = BatchStatus.Processing;
        emit ProductProcessed(_batchId, _processType, msg.sender);
    }

    // 🚚 Add Transportation Details
    function addTransportationDetails(
        uint256 _batchId,
        string memory _mode,
        string memory _carrierName,
        string memory _licensePlate,
        string memory _routeInfo,
        string memory _additionalNotes
    ) public validBatchId(_batchId) isCurrentCustodian(_batchId) {
        ProductBatch storage batch = batches[_batchId];
        batch.transportationDetails.push(TransportationDetail({
            mode: _mode,
            carrierName: _carrierName,
            licensePlate: _licensePlate,
            routeInfo: _routeInfo,
            additionalNotes: _additionalNotes,
            timestamp: block.timestamp
        }));
        batch.status = BatchStatus.InTransit;
        emit ProductShipped(_batchId, _mode, msg.sender);
    }

    // 🔁 Transfer Custody
    function transferCustody(
        uint256 _batchId,
        address _newCustodian,
        string memory _reason,
        string memory _location,
        string memory _notes
    ) public validBatchId(_batchId) isCurrentCustodian(_batchId) {
        ProductBatch storage batch = batches[_batchId];
        batch.custodyHistory.push(CustodyRecord({
            from: msg.sender,
            to: _newCustodian,
            reason: _reason,
            location: _location,
            notes: _notes,
            timestamp: block.timestamp
        }));
        emit CustodyTransferred(_batchId, msg.sender, _newCustodian);
    }

    // 📥 Mark as Received
    function markAsReceived(
        uint256 _batchId,
        string memory _receiverName
    ) public validBatchId(_batchId) isCurrentCustodian(_batchId) {
        batches[_batchId].status = BatchStatus.Received;
        emit BatchReceived(_batchId, _receiverName, msg.sender);
        emit BatchStatusUpdatedEvent(_batchId, uint8(BatchStatus.Received));
    }

    // 🕵️‍♀️ Get Batch Details
    function getBatchDetails(uint256 _batchId) public view returns (
        address farmerAddress,
        string memory productName,
        string memory variety,
        uint256 quantity,
        uint256 harvestDate,
        string memory organicStatus,
        string memory additionalNotes,
        BatchStatus status,
        address currentHolder
    ) {
        ProductBatch storage batch = batches[_batchId];
        address holder = batch.custodyHistory.length > 0 ? batch.custodyHistory[batch.custodyHistory.length - 1].to : address(0);
        return (
            batch.farmerAddress,
            batch.productName,
            batch.variety,
            batch.quantity,
            batch.harvestDate,
            batch.organicStatus,
            batch.additionalNotes,
            batch.status,
            holder
        );
    }
}
